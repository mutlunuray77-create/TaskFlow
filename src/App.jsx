import { Col, Row, Card, message, Tag, Drawer, Divider, ConfigProvider, Button } from "antd";
import { useState, useEffect } from "react";
import { 
  CheckCircleOutlined, 
  PlayCircleOutlined, 
  ClockCircleOutlined,
  UnorderedListOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import GorevEkle from "./GorevEkle";
import GorevDuzenle from "./GorevDuzenle";
import localData from "./database/gorevler.json";

function App() {
  // Proje durumu ve veriler için state tanımları
  const [gorevListesi, setGorevListesi] = useState([]);
  const [drawerAcik, setDrawerAcik] = useState(false);
  const [seciliGorev, setSeciliGorev] = useState(null);

  // Veriyi JSON dosyasından yükle
  useEffect(() => {
    setGorevListesi(localData);
  }, []);

  // Yeni görev ekleme mantığı
  const yeniGorevEkle = (baslik) => {
    const yeniObje = {
      id: Date.now(),
      title: baslik,
      detail: "Henüz detay girilmedi.",
      status: "Bekliyor",
    };
    setGorevListesi([...gorevListesi, yeniObje]);
    message.success("Görev başarıyla eklendi");
  };

  // Görev bilgilerini güncelleme
  const gorevGuncelle = (id, yeniBilgiler) => {
    const güncellenmişListe = gorevListesi.map((g) => 
      g.id === id ? { ...g, ...yeniBilgiler } : g
    );
    setGorevListesi(güncellenmişListe);
    
    // Eğer drawer o an açıksa içindeki bilgiyi de tazele
    if (seciliGorev?.id === id) {
      setSeciliGorev({ ...seciliGorev, ...yeniBilgiler });
    }
  };

  // --- Kendi Bileşenimiz (TaskCard) ---
  const TaskCard = ({ gorev }) => (
    <Card 
      className="rounded-xl border-gray-200 shadow-sm hover:shadow-md transition-all"
      bodyStyle={{ padding: '16px' }}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-slate-800 m-0">{gorev.title}</h4>
        <GorevDuzenle task={gorev} onUpdate={gorevGuncelle} />
      </div>
      <p className="text-gray-400 text-xs mt-2 line-clamp-1 italic">{gorev.detail}</p>
      <Button 
        type="link" 
        className="p-0 mt-3 text-xs flex items-center" 
        onClick={() => { setSeciliGorev(gorev); setDrawerAcik(true); }}
      >
        Detayları Gör <ArrowRightOutlined className="ml-1" />
      </Button>
    </Card>
  );

  return (
    <ConfigProvider theme={{ token: { borderRadius: 10, colorPrimary: '#1d4ed8' } }}>
      <div className="min-h-screen bg-slate-50 p-6">
        
        {/* Üst Başlık ve Ekleme Butonu */}
        <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <UnorderedListOutlined className="text-blue-600 text-2xl" />
            <div>
              <h1 className="text-xl font-bold text-slate-800 m-0">TaskFlow</h1>
              <p className="text-slate-400 text-xs m-0">Nuray Mutlu - Görev Takip Paneli</p>
            </div>
          </div>
          <GorevEkle onGorevEkle={yeniGorevEkle} />
        </div>

        {/* Ana Board Tasarımı */}
        <Row gutter={[16, 16]} justify="center" className="max-w-7xl mx-auto">
          {[
            { baslik: "Bekleyenler", durum: "Bekliyor", ikon: <ClockCircleOutlined className="text-slate-400" /> },
            { baslik: "Devam Edenler", durum: "Devam Ediyor", ikon: <PlayCircleOutlined className="text-blue-500" /> },
            { baslik: "Tamamlananlar", durum: "Tamamlandi", ikon: <CheckCircleOutlined className="text-green-500" /> }
          ].map((sutun) => (
            <Col xs={24} md={8} key={sutun.durum}>
              <div className="bg-slate-200/50 p-4 rounded-2xl min-h-[500px] border border-slate-200">
                <div className="flex items-center gap-2 mb-4 px-1">
                  {sutun.ikon}
                  <span className="font-bold text-slate-600 text-sm uppercase tracking-wider">{sutun.baslik}</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  {gorevListesi
                    .filter(g => g.status === sutun.durum)
                    .map(item => <TaskCard key={item.id} gorev={item} />)
                  }
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Bilgi Çekmecesi (Drawer) */}
        <Drawer 
          title="Görev Bilgileri" 
          onClose={() => setDrawerAcik(false)} 
          open={drawerAcik} 
          width={400}
        >
          {seciliGorev && (
            <div className="flex flex-col gap-5">
              <Tag color="blue" className="w-fit">{seciliGorev.status}</Tag>
              <h2 className="text-xl font-bold text-slate-800">{seciliGorev.title}</h2>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Açıklama</span>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{seciliGorev.detail}</p>
              </div>
              
              <Divider />
              <div className="text-gray-300 text-[10px] flex justify-between">
                <span>Versiyon 1.0</span>
                <span>ID: {seciliGorev.id}</span>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
}

export default App;