import React, { useState, useEffect } from "react";
import { Col, Row, Card, message, Tag, Drawer, Divider, ConfigProvider, Button, Input, List } from "antd";
import { 
  CheckCircleOutlined, 
  PlayCircleOutlined, 
  ClockCircleOutlined,
  UnorderedListOutlined,
  ArrowRightOutlined,
  SendOutlined
} from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import GorevEkle from "./GorevEkle";
import GorevDuzenle from "./GorevDuzenle";
import initialData from "./database/gorevler.json";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const preparedData = initialData.map(item => ({
      ...item,
      comments: item.comments || [],
      completedDate: item.completedDate || null
    }));
    setTasks(preparedData);
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(t => t.id.toString() === draggableId);
    const draggedTask = updatedTasks[taskIndex];

    const oldStatus = draggedTask.status;
    draggedTask.status = destination.droppableId;

    if (destination.droppableId === "Tamamlandi" && oldStatus !== "Tamamlandi") {
      draggedTask.completedDate = new Date().toLocaleString();
      message.success("Harika! Bir görevi daha bitirdin.");
    }

    setTasks(updatedTasks);
  };

  const handleAddNewTask = (title) => {
    const newTask = {
      id: Date.now(),
      title: title,
      detail: "Detaylar yolda...",
      status: "Bekliyor",
      comments: [],
      completedDate: null
    };
    setTasks([...tasks, newTask]);
    message.success("Yeni görev listeye eklendi.");
  };

  const handleUpdateTask = (id, newFields) => {
    const newList = tasks.map(t => t.id === id ? { ...t, ...newFields } : t);
    setTasks(newList);
    if (activeTask?.id === id) setActiveTask({ ...activeTask, ...newFields });
  };

  const postComment = () => {
    if (!commentText.trim()) return;
    
    const updated = {
      ...activeTask,
      comments: [...activeTask.comments, { id: Date.now(), text: commentText, date: new Date().toLocaleString() }]
    };
    
    setTasks(tasks.map(t => t.id === activeTask.id ? updated : t));
    setActiveTask(updated);
    setCommentText("");
  };

  return (
    <ConfigProvider theme={{ token: { borderRadius: 12, colorPrimary: '#2563eb' } }}>
      <div className="min-h-screen bg-[#f8fafc] p-8">
        
        <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <UnorderedListOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 m-0 tracking-tight">TaskFlow</h1>
              <p className="text-slate-400 text-sm m-0 font-medium">Nuray Mutlu • Proje Yönetim Alanı</p>
            </div>
          </div>
          <GorevEkle onGorevEkle={handleAddNewTask} />
        </header>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Row gutter={[24, 24]} justify="center" className="max-w-7xl mx-auto">
            {[
              { label: "Bekleyenler", key: "Bekliyor", icon: <ClockCircleOutlined className="text-slate-400" /> },
              { label: "Devam Edenler", key: "Devam Ediyor", icon: <PlayCircleOutlined className="text-blue-500" /> },
              { label: "Tamamlananlar", key: "Tamamlandi", icon: <CheckCircleOutlined className="text-emerald-500" /> }
            ].map((column) => (
              <Col xs={24} lg={8} key={column.key}>
                <div className="bg-[#f1f5f9] p-5 rounded-[2rem] min-h-[650px] border border-slate-200/60">
                  <div className="flex items-center gap-3 mb-6 ml-2">
                    {column.icon}
                    <h3 className="font-bold text-slate-500 text-sm uppercase m-0 tracking-widest">{column.label}</h3>
                  </div>
                  
                  <Droppable droppableId={column.key}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4 min-h-[550px]">
                        {tasks
                          .filter(t => t.status === column.key)
                          .map((item, index) => (
                            <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="flex justify-between items-start">
                                      <span className="font-bold text-slate-700 leading-tight">{item.title}</span>
                                      <GorevDuzenle task={item} onUpdate={handleUpdateTask} />
                                    </div>
                                    <p className="text-slate-400 text-[13px] mt-2 line-clamp-2">{item.detail}</p>
                                    <Button 
                                      type="text" 
                                      className="p-0 mt-4 text-blue-600 font-semibold text-xs hover:bg-transparent"
                                      onClick={() => { setActiveTask(item); setIsDrawerOpen(true); }}
                                    >
                                      Detayı İncele <ArrowRightOutlined className="ml-1" />
                                    </Button>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </Col>
            ))}
          </Row>
        </DragDropContext>

        <Drawer 
          title={<span className="font-bold text-slate-700">Görev Detayları</span>}
          onClose={() => setIsDrawerOpen(false)} 
          open={isDrawerOpen} 
          width={450}
          className="rounded-l-[2rem]"
        >
          {activeTask && (
            <div className="flex flex-col h-full gap-6">
              <div className="flex justify-between items-center">
                <Tag color={activeTask.status === "Tamamlandi" ? "green" : "blue"} className="rounded-full px-3 border-none font-bold">
                  {activeTask.status}
                </Tag>
                {activeTask.completedDate && (
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 m-0 uppercase font-bold">Tamamlanma</p>
                    <span className="text-xs text-emerald-600 font-semibold">{activeTask.completedDate}</span>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-black text-slate-800 leading-tight">{activeTask.title}</h2>
              
              <div className="bg-slate-50 p-5 rounded-2xl">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Açıklama</label>
                <p className="text-slate-600 text-[15px] mt-2 italic">"{activeTask.detail}"</p>
              </div>

              <Divider className="my-2" />
              <h4 className="text-sm font-bold text-slate-700 mb-2">Yorumlar ({activeTask.comments?.length || 0})</h4>
              
              <div className="flex-1 overflow-y-auto pr-2">
                <List
                  dataSource={activeTask.comments}
                  renderItem={c => (
                    <div className="mb-4 bg-blue-50/30 p-3 rounded-xl border border-blue-100/20">
                      <p className="m-0 text-slate-700 text-sm">{c.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{c.date}</span>
                    </div>
                  )}
                />
              </div>

              <div className="flex gap-2 mt-auto pb-4">
                <Input 
                  placeholder="Bir şeyler yaz..." 
                  value={commentText}
                  variant="filled"
                  onChange={(e) => setCommentText(e.target.value)}
                  onPressEnter={postComment}
                  className="rounded-xl"
                />
                <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={postComment} />
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
}

export default App;