import { Button, Modal, Input, Form, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

function GorevDuzenle({ task, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) form.setFieldsValue(task);
  }, [open, task, form]);

  return (
    <>
      <Button type="text" icon={<EditOutlined className="text-slate-400 hover:text-blue-500" />} onClick={() => setOpen(true)} />

      <Modal 
        title="Görevi Düzenle" 
        open={open} 
        onOk={() => form.validateFields().then(v => { onUpdate(task.id, v); setOpen(false); })}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="title" label="Başlık"><Input /></Form.Item>
          <Form.Item name="detail" label="Detay"><Input.TextArea rows={4} /></Form.Item>
          <Form.Item name="status" label="Durum">
            <Select>
              <Select.Option value="Bekliyor">Bekliyor</Select.Option>
              <Select.Option value="Devam Ediyor">Devam Ediyor</Select.Option>
              <Select.Option value="Tamamlandi">Tamamlandı</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default GorevDuzenle;