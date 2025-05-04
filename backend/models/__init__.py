# models/__init__.py

# from .v1.User import User
# from .v1.UserSTL import UserSTL
# from .v1.STL import STL
# from .v1.Doctor import Doctor
# from .v1.Tech import Tech
from .users import User
from .doctors import Doctor
from .technicians import Technician
from .cases import Case
from .case_files import CaseFile
from .case_surgeons import CaseSurgeon
from .profile_pic_files import ProfilePicFile
from .quick_cases import QuickCase
from .quick_case_files import QuickCaseFile
from .notifications import Notification