import { Col, Row, Card, message, Tag, Drawer, Divider, ConfigProvider, Button } from "antd";
import { useState, useEffect } from "react";
// İkonları tek tek kontrol ettim, bunlar standart Ant Design ikonlarıdır:
import { 
  UnorderedListOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import GorevEkle from "./GorevEkle";
import GorevDuzenle from "./GorevDuzenle";
import localData from "./database/gorevler.json";

function App() {
  // --- State Tanımları ---
  const [gorevler, setGorevler] = useState([]);
  const [drawerAcik, setDrawerAcik] = useState(false);
  const [seciliGorev, setSeciliGorev] = useState(null);

  // Veriyi JSON dosyasından çekiyoruz
  useEffect(() => {
    // localData direkt import edildiği için state'e atıyoruz
    setGorevler(localData);
  }, []);

  // Yeni görev ekleme fonksiyonu (GorevEkle bileşeninden çağrılır)
  const handleGorevEkle = (yeniBaslik) => {
    const yeniGorev = {
      id: Date.now(),
      title: yeniBaslik,
      detail: "Detay girilmedi.",
      status: "Bekliyor",
    };
    setGorevler([...gorevler, yeniGorev]);
    message.success("Görev başarıyla eklendi");
  };

  // Mevcut görevi güncelleme fonksiyonu (GorevDuzenle bileşeninden çağrılır)
  const handleGuncelle = (id, guncelVeriler) => {
    const yeniListe = gorevler.map((g) => (g.id === id ? { ...g, ...guncelVeriler } : g));
    setGorevler(yeniListe);
    
    // Eğer o an Drawer'da açık olan görev güncellendiyse, orayı da yenile
    if (seciliGorev?.id === id) {
      setSeciliGorev({ ...seciliGorev, ...guncelVeriler });
    }
  };

  return (
    <ConfigProvider theme={{ token: { borderRadius: 10, colorPrimary: '#1677ff' } }}>
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '30px' }}>
        
        {/* Üst Header Kısmı */}
        <header style={{ 
          maxWidth: '1100px', 
          margin: '0 auto 30px auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <UnorderedListOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '20px' }}>TaskFlow Panel</h1>
              <p style={{ margin: 0, color: '#8c8c8c', fontSize: '12px' }}>Nuray Mutlu | Proje Ödevi</p>
            </div>
          </div>
          <GorevEkle onGorevEkle={handleGorevEkle} />
        </header>

        {/* Board (Sütunlar) */}
        <Row gutter={[20, 20]} justify="center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { baslik: "Bekleyenler", durum: "Bekliyor", ikon: <ClockCircleOutlined /> },
            { baslik: "Devam Edenler", durum: "Devam Ediyor", ikon: <SyncOutlined spin /> },
            { baslik: "Tamamlananlar", durum: "Tamamlandi", ikon: <CheckCircleOutlined /> }
          ].map((sutun) => (
            <Col xs={24} md={8} key={sutun.durum}>
              <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '15px', minHeight: '500px' }}>
                <h3 style={{ textAlign: 'center', color: '#595959', marginBottom: '20px' }}>
                  {sutun.ikon} {sutun.baslik.toUpperCase()}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {gorevler.filter(g => g.status === sutun.durum).map(gorev => (
                    <Card 
                      key={gorev.id} 
                      hoverable 
                      bodyStyle={{ padding: '15px' }}
                      style={{ borderRadius: '8px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: '600', color: '#262626' }}>{gorev.title}</span>
                        <GorevDuzenle task={gorev} onUpdate={handleGuncelle} />
                      </div>
                      <p style={{ color: '#8c8c8c', fontSize: '11px', marginTop: '8px' }}>
                        {gorev.detail.substring(0, 50)}...
                      </p>
                      <Button 
                        type="link" 
                        size="small" 
                        style={{ padding: 0, marginTop: '10px' }}
                        onClick={() => { setSeciliGorev(gorev); setDrawerAcik(true); }}
                      >
                        Detaylar <ArrowRightOutlined style={{ fontSize: '10px' }} />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Sağdan Açılan Bilgi Paneli */}
        <Drawer 
          title="Görev Ayrıntıları" 
          onClose={() => setDrawerAcik(false)} 
          open={drawerAcik} 
          width={380}
        >
          {seciliGorev && (
            <div>
              <Tag color="processing">{seciliGorev.status}</Tag>
              <h2 style={{ marginTop: '15px' }}>{seciliGorev.title}</h2>
              <Divider orientation="left">Açıklama</Divider>
              <div style={{ background: '#fafafa', padding: '15px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                {seciliGorev.detail}
              </div>
              <p style={{ marginTop: '30px', color: '#d9d9d9', fontSize: '10px' }}>
                ID: {seciliGorev.id}
              </p>
            </div>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
}

export default App;