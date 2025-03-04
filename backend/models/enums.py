from enum import Enum

class Role(str, Enum):  # Subclass both str and Enum
    ADMIN = "admin"
    TECH = "tech"
    DOCTOR = "doctor"

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_
