import axios from '@/config/axiosConfig';
import { List, Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import queryClient from '@/config/queryClient';
import { useNotificationList } from '@/services/notification/notification.service';

const NotificationListTechnician = () => {
  const navigate = useNavigate();
  const { data: notifications } = useNotificationList();

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/notification/${id}/read`);
      queryClient.invalidateQueries({ queryKey: ['notification', 'hasUnread', 'list'] });
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  

  return (
    <>
      <List


        itemLayout='horizontal'
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              backgroundColor: item.is_read ? 'inherit' : '#f6faff',
            }}
            actions={[
              !item.is_read && (
                <Button type='link' onClick={() => markAsRead(item.id)}>
                  Mark as read
                </Button>
              ),
              item.related_case_id && (
                <Button onClick={() => navigate(`/case/quick-case/${item.related_case_id}`)} type='link'>
                  View Case
                </Button>
              ),
            ]}
          >
            <Space>
              <Typography.Text type='secondary'>{new Date(item.created_at).toLocaleString()}</Typography.Text>{' '}
              <Typography.Text>
                {item.message.split('by')[0]}by
                <strong> {item.message.split('by')[1]}</strong>
              </Typography.Text>
            </Space>
          </List.Item>
        )}
      />
    </>
  );
};

export default NotificationListTechnician;
