"""Fix case_file_versions FK ondelete cascade

Revision ID: 11f81e5140bb
Revises: a37a62e30bf0
Create Date: 2025-05-08 06:11:05.477230

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '11f81e5140bb'
down_revision = 'a37a62e30bf0'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('case_file_versions', schema=None) as batch_op:
        batch_op.drop_constraint('case_file_versions_case_file_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            None, 'case_files', ['case_file_id'], ['id'], ondelete='CASCADE'
        )


def downgrade():
    with op.batch_alter_table('case_file_versions', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(
            'case_file_versions_case_file_id_fkey', 'case_files', ['case_file_id'], ['id']
        )
