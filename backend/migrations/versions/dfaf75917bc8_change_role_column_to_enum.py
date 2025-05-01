import sqlalchemy as sa
import enum
from alembic import op

# revision identifiers, used by Alembic.
revision = 'dfaf75917bc8'
down_revision = 'abf7ec6a2c04'
branch_labels = None
depends_on = None

class RoleEnum(enum.Enum):
    admin = "admin"
    doctor = "doctor"
    technician = "technician"

role_enum = sa.Enum(RoleEnum, name="role")

def upgrade():
    role_enum.create(op.get_bind())

    with op.batch_alter_table('user') as batch_op:
        batch_op.alter_column(
            'role',
            type_=role_enum,
            postgresql_using="role::text::role"
        )

def downgrade():
    with op.batch_alter_table('user') as batch_op:
        batch_op.alter_column(
            'role',
            type_=sa.String(length=255),
            postgresql_using="role::text"
        )
    role_enum.drop(op.get_bind())