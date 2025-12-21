import { Button, Modal, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

function GorevEkle({ onGorevEkle }) {
  const [open, setOpen] = useState(false);
  const [baslik, setBaslik] = useState("");

  const handleOk = () => {
    if (!baslik.trim()) return message.warning("Lütfen bir başlık girin");
    onGorevEkle(baslik);
    setBaslik("");
    setOpen(false);
  };

  return (
    <>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => setOpen(true)}
        className="rounded-xl h-11 px-6 font-bold shadow-md hover:scale-105 transition-transform border-none"
      >
        Yeni Görev
      </Button>

      <Modal title="Yeni Görev Ekle" open={open} onOk={handleOk} onCancel={() => setOpen(false)}>
        <Input 
          placeholder="Görev başlığını buraya yazın..." 
          value={baslik} 
          onChange={(e) => setBaslik(e.target.value)}
          className="mt-4 rounded-lg"
        />
      </Modal>
    </>
  );
}

export default GorevEkle;