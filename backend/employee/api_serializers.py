from rest_framework import serializers
from employee.models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        extra_kwargs = {
            'employee_profile': {'required': False, 'allow_null': True},
            'employee_bank_details_id': {'required': False, 'allow_null': True},
            'employee_work_info_id': {'required': False, 'allow_null': True},
            'badge_id': {'required': False, 'allow_null': True},
            'employee_last_name': {'required': False, 'allow_null': True},
            'address': {'required': False, 'allow_null': True},
            'country': {'required': False, 'allow_null': True},
            'state': {'required': False, 'allow_null': True},
            'city': {'required': False, 'allow_null': True},
            'zip': {'required': False, 'allow_null': True},
            'dob': {'required': False, 'allow_null': True},
            'qualification': {'required': False, 'allow_null': True},
            'experience': {'required': False, 'allow_null': True},
            'marital_status': {'required': False, 'allow_null': True},
            'children': {'required': False, 'allow_null': True},
            'emergency_contact': {'required': False, 'allow_null': True},
            'emergency_contact_name': {'required': False, 'allow_null': True},
            'emergency_contact_relation': {'required': False, 'allow_null': True},
            'additional_info': {'required': False, 'allow_null': True},
        }
