from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('-created_at')
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'employee_id', 'email', 'department']

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total_employees = Employee.objects.count()
        total_attendance = Attendance.objects.count()
        
        # Calculate stats for today
        from datetime import date
        today = date.today()
        present_today = Attendance.objects.filter(date=today, status='Present').count()
        absent_today = Attendance.objects.filter(date=today, status='Absent').count()
        
        # Dept-wise distribution
        dept_stats = Employee.objects.values('department').annotate(count=Count('id'))
        
        return Response({
            'total_employees': total_employees,
            'total_attendance': total_attendance,
            'present_today': present_today,
            'absent_today': absent_today,
            'dept_stats': dept_stats
        })

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by('-date')
    serializer_class = AttendanceSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date']

    def get_queryset(self):
        queryset = Attendance.objects.all().order_by('-date')
        employee_id = self.request.query_params.get('employee_id', None)
        if employee_id is not None:
            queryset = queryset.filter(employee__id=employee_id)
        return queryset

    def create(self, request, *args, **kwargs):
        # Handle duplicate attendance check
        employee_id = request.data.get('employee')
        date = request.data.get('date')
        
        if Attendance.objects.filter(employee_id=employee_id, date=date).exists():
            return Response(
                {"error": "Attendance already marked for this employee on this date."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)
