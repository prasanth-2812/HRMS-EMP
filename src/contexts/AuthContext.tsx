import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { AuthContextType, User, RegisterData, LoginCredentials, UserRole } from '../types/auth.d';
import { 
  loginApi, 
  registerApi, 
  forgotPasswordApi, 
  resetPasswordApi, 
  logoutApi, 
  getUserProfileApi,
  LoginResponse,
  RegisterResponse
} from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      console.log('Checking auth status:', { hasToken: !!token, hasUserData: !!userData });
      
      if (token && userData) {
        try {
          // Restore user from localStorage
          const parsedUser = JSON.parse(userData);
          console.log('Restoring user session:', parsedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error('Error parsing user data:', err);
          // Invalid user data, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('backendData');
          setUser(null);
        }
      } else {
        console.log('No existing session found');
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: LoginResponse = await loginApi(credentials.username, credentials.password);
      
      // Store token (no refresh token in this backend)
      localStorage.setItem('authToken', response.access);
      
      // Create user object from employee data
      const userData: User = {
        id: response.employee.id,
        email: response.employee.email,
        firstName: response.employee.first_name,
        lastName: response.employee.last_name,
        role: UserRole.EMPLOYEE, // You can update this based on your backend response
        isActive: response.employee.is_active,
        lastLogin: new Date(),
      };
      
      // Store additional backend data
      const backendData = {
        face_detection: response.face_detection,
        face_detection_image: response.face_detection_image,
        geo_fencing: response.geo_fencing,
        company_id: response.company_id,
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('backendData', JSON.stringify(backendData));
      
      console.log('Setting user state after login:', userData);
      setUser(userData);
      console.log('User state should now be set');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: RegisterResponse = await registerApi({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        username: data.email, // Using email as username, adjust as needed
        password: data.password,
        password2: data.confirmPassword,
      });
      
      // After successful registration, you might want to auto-login
      // or redirect to login page
      console.log('Registration successful:', response.message);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (username: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await forgotPasswordApi(username);
      console.log('Password reset email sent:', response.message);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await resetPasswordApi({
        token,
        password,
        password2: confirmPassword,
      });
      
      console.log('Password reset successful:', response.message);
      
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await logoutApi();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('backendData');
      setUser(null);
    }
  };

  const authValue: AuthContextType = {
    user,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    isLoading,
    error,
    isAuthenticated: !!user,
  };

  console.log('AuthContext state:', { user, isAuthenticated: !!user, isLoading });

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
