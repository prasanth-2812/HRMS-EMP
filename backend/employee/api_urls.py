from django.urls import path
from .api_views import EmployeeListCreateAPIView, EmployeeRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('employees/', EmployeeListCreateAPIView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeRetrieveUpdateDestroyAPIView.as_view(), name='employee-detail'),
]
