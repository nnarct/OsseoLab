from enum import Enum

class RoleEnum(Enum):
    admin = "admin"
    doctor = "doctor"
    technician = "technician"

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_

class GenderEnum(Enum):
    male = "male"
    female = "female"
    other = "other"
