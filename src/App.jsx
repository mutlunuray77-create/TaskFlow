import { Col, Row, Card, message, Tag, Drawer, Divider, ConfigProvider } from "antd";
import { useState, useEffect } from "react";
import { 
  CheckCircleFilled, 
  PlayCircleFilled, 
  PauseCircleFilled, 
  LayoutOutlined,
  RightOutlined
} from "@ant-design/icons";
import GorevEkle from "./GorevEkle";
import GorevDuzenle from "./GorevDuzenle";
import localData from "./database/gorevler.json";

function App() {
  const [veri, setVeri] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  useEffect(() => {
    setVeri(localData);
  }, []);

  const handleYeniGorevEkle = (yeniBaslik) => {
    const yeniGorev = {
      id: Date.now(),
      title: yeniBaslik,
      detail: "Henüz detay girilmedi.",
      status: "Bekliyor",
    };
    setVeri([...veri, yeniGorev]);
    message.success("Görev panoya eklendi");
  };

  const handleGuncelle = (id, guncelVeriler) => {
    setVeri(veri.map((item) => (item.id === id ? { ...item, ...guncelVeriler } : item)));
    if (viewTask?.id === id) setViewTask({ ...viewTask, ...guncelVeriler });
  };

  return (
    <ConfigProvider theme={{ token: { borderRadius: 20, colorPrimary: '#2563eb' } }}>
      <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12">
        
        {/* ÜST PANEL */}
        <header className="max-w-[1200px] mx-auto mb-12 flex justify-between items-center bg-white/70 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <LayoutOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 m-0 tracking-tight">TaskFlow</h1>
              <p className="text-slate-500 text-xs font-medium m-0">Proje Yönetim Paneli</p>
            </div>
          </div>
          <GorevEkle onGorevEkle={handleYeniGorevEkle} />
        </header>

        {/* ORTALANMIŞ KANBAN KOLONLARI */}
        <Row gutter={[24, 24]} justify="center" className="max-w-[1400px] mx-auto">
          {[
            { title: "Bekleyenler", status: "Bekliyor", icon: <PauseCircleFilled className="text-slate-400" />, bg: "bg-slate-200/40", border: "border-slate-200" },
            { title: "Devam Edenler", status: "Devam Ediyor", icon: <PlayCircleFilled className="text-blue-500" />, bg: "bg-blue-100/40", border: "border-blue-200" },
            { title: "Tamamlananlar", status: "Tamamlandi", icon: <CheckCircleFilled className="text-emerald-500" />, bg: "bg-emerald-100/40", border: "border-emerald-200" }
          ].map((col) => (
            <Col xs={24} md={12} lg={7} key={col.status}>
              <div className={`${col.bg} p-6 rounded-[2.5rem] border ${col.border} min-h-[600px] shadow-sm`}>
                <div className="flex items-center gap-2 mb-6 px-2">
                  <span className="text-xl">{col.icon}</span>
                  <h3 className="font-bold text-slate-700 m-0 uppercase text-[11px] tracking-widest">{col.title}</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {veri.filter(g => g.status === col.status).map(gorev => (
                    <TaskCard key={gorev.id} gorev={gorev} onEdit={handleGuncelle} onView={() => {setViewTask(gorev); setDrawerOpen(true);}} />
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* DETAY DRAWER - TAŞMA SORUNU ÇÖZÜLMÜŞ */}
        <Drawer 
          title={<span className="font-bold text-slate-800">Görev Ayrıntıları</span>} 
          onClose={() => setDrawerOpen(false)} 
          open={drawerOpen} 
          width={450}
          className="rounded-l-[2rem]"
        >
          {viewTask && (
            <div className="flex flex-col gap-6">
              <Tag color={viewTask.status === 'Tamamlandi' ? 'green' : 'blue'} className="w-fit rounded-full px-4 border-none font-bold">
                {viewTask.status}
              </Tag>
              
              <h2 className="text-2xl font-black text-slate-800 leading-tight break-words">
                {viewTask.title}
              </h2>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-3 tracking-widest">Açıklama</label>
                <p className="text-slate-600 leading-relaxed text-base m-0 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                  {viewTask.detail}
                </p>
              </div>

              <Divider />
              <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest px-2">
                <span>Taskflow v1.0</span>
                <span>Ref: #{viewTask.id.toString().slice(-6)}</span>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
}

const TaskCard = ({ gorev, onEdit, onView }) => (
  <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-all duration-300" bodyStyle={{ padding: '20px' }}>
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-bold text-slate-800 m-0 flex-1 leading-snug break-words line-clamp-2 italic">
          {gorev.title}
        </h4>
        <GorevDuzenle task={gorev} onUpdate={onEdit} />
      </div>
      <p className="text-slate-400 text-[11px] m-0 line-clamp-2 leading-normal italic">
        {gorev.detail}
      </p>
      <button 
        onClick={onView}
        className="text-blue-600 text-[10px] font-black flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-tighter w-fit mt-1 border-none bg-transparent cursor-pointer"
      >
        DETAYLARI İNCELE <RightOutlined style={{ fontSize: '9px' }} />
      </button>
    </div>
  </Card>
);

export default App;