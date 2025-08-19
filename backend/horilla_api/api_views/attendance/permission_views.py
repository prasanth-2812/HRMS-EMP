from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from base.methods import is_reportingmanager


class AttendancePermissionCheck(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Returns attendance permissions for the current user
        """
        user = request.user
        is_manager = is_reportingmanager(request)
        
        permissions = {
            "can_view_attendance": user.has_perm("attendance.view_attendance") or is_manager,
            "can_create_attendance": user.has_perm("attendance.add_attendance") or is_manager,
            "can_edit_attendance": user.has_perm("attendance.change_attendance") or is_manager,
            "can_delete_attendance": user.has_perm("attendance.delete_attendance") or is_manager,
            "can_approve_attendance": user.has_perm("attendance.change_attendance") or is_manager,
            "can_validate_attendance": user.has_perm("attendance.change_attendance") or is_manager,
            "can_view_reports": user.has_perm("attendance.view_attendance") or is_manager,
            "can_manage_overtime": user.has_perm("attendance.change_overtime") or is_manager,
            "can_view_all_employees": user.has_perm("attendance.view_attendance") or is_manager,
            "can_export_data": user.has_perm("attendance.view_attendance") or is_manager,
        }
        
        return Response(permissions, status=200)
