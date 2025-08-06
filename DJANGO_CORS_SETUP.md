# Django CORS Setup Guide - FIXED VERSION

## Critical Fix: Circular Import Issue

### Problem
Your `settings.py` has a circular import that's preventing Django from starting:

```python
# ❌ REMOVE THIS LINE FROM settings.py
import notifications.urls
```

### Solution
Remove the problematic import from your `settings.py` file. The `notifications.urls` should only be imported in your `urls.py` file, not in `settings.py`.

## Current Issues in Your Settings

### 1. CORS Middleware Position (CRITICAL FIX)
Your `MIDDLEWARE` has `corsheaders.middleware.CorsMiddleware` in the wrong position.

**Current (WRONG):**
```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # ❌ WRONG POSITION
    # ... rest
]
```

**Fixed (CORRECT):**
```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # ✅ MUST BE FIRST
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # ... rest
]
```

### 2. Add Your Frontend URL to CORS_ALLOWED_ORIGINS

**Current:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

**Fixed:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.92.116:3000",  # ✅ ADD YOUR FRONTEND URL
    "http://127.0.0.1:3000",
]
```

### 3. Add Additional CORS Settings

Add these settings to your `settings.py`:

```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.92.116:3000",  # Your frontend URL
    "http://127.0.0.1:3000",
]

# Allow credentials (cookies, authorization headers)
CORS_ALLOW_CREDENTIALS = True

# Allow specific headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Allow specific methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# For development only - allows all origins (alternative)
# CORS_ALLOW_ALL_ORIGINS = True
```

## Complete Fixed Settings.py

Here are the specific changes you need to make:

### 1. Remove Circular Import
**Remove this line from settings.py:**
```python
# ❌ DELETE THIS LINE
import notifications.urls
```

### 2. Fix MIDDLEWARE Order
```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # ✅ FIRST POSITION
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
```

### 3. Update CORS Settings
```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.92.116:3000",  # Your frontend URL
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

## Check Your API Endpoints

Your `urls.py` shows:
```python
path("api/v1/", include("horilla_api.urls")),
```

Make sure your `horilla_api/urls.py` includes the auth endpoints:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/', views.logout_view, name='logout'),
    # ... other endpoints
]
```

## Test Steps

1. **Remove the circular import** from settings.py
2. **Update your settings.py** with the fixes above
3. **Restart Django server:**
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
4. **Test the connection** using the buttons on your login page
5. **Check browser console** for detailed error messages

## Quick Test Commands

```bash
# Test if Django is running
cu
rl http://127.0.0.1:8000/health/

# Test if API endpoint exists
curl http://127.0.0.1:8000/api/v1/auth/login/
```

## Backend Authentication Fix

Here's the corrected backend code for your `auth/views.py`:

```python
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from ...api_serializers.auth.serializers import GetEmployeeSerializer


class LoginAPIView(APIView):
    def post(self, request):
        if "username" and "password" in request.data.keys():
            username = request.data.get("username")
            password = request.data.get("password")
            user = authenticate(username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                employee = user.employee_get
                
                # Initialize variables with default values
                face_detection = False
                face_detection_image = None
                geo_fencing = False
                company_id = None
                
                try:
                    face_detection = employee.get_company().face_detection.start
                except:
                    pass
                try:
                    geo_fencing = employee.get_company().geo_fencing.start
                except:
                    pass
                try:
                    face_detection_image = employee.face_detection.image.url
                except:
                    pass
                try:
                    company_id = employee.get_company().id
                except:
                    pass
                
                result = {
                    "employee": GetEmployeeSerializer(employee).data,
                    "access": str(refresh.access_token),
                    "face_detection": face_detection,
                    "face_detection_image": face_detection_image,
                    "geo_fencing": geo_fencing,
                    "company_id": company_id,
                }
                return Response(result, status=200)
            else:
                return Response({"error": "Invalid credentials"}, status=401)
        else:
            return Response({"error": "Please provide Username and Password"})
```

## Key Changes Made:

1. **Initialized `company_id` variable**: Added `company_id = None` before the try-except blocks
2. **Consistent variable initialization**: All variables are now initialized with default values before the try-except blocks
3. **Safe error handling**: Even if the try blocks fail, the variables will have default values

## Frontend Integration:

The frontend has been updated to handle this response structure correctly. The authentication flow will now work properly with your Django backend.

## Testing:

1. Update your backend code with the fix above
2. Restart your Django server
3. Test the login endpoint from your frontend

The error should be resolved and the login should work correctly. 