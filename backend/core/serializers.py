from rest_framework import serializers
from .models import Employee, Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.full_name')
    
    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'status']

class EmployeeSerializer(serializers.ModelSerializer):
    # Optional: include recent attendance in employee list
    # attendances = AttendanceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at']
