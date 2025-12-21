import { Drawer } from "antd";
const TaskDrawer = ({open,onClose,task}) =>{
    return (
        <Drawer
        title="Görev Detayı"
        open={open}
        onClose={onClose}
        width={400}>
            {task?(
                <>
                <h3>{task.title}</h3>
                <p>{task.detail}</p>
                <p><b>ID:</b> {task.id}</p>
                </>
            ):(
                <p>Görev seçilmedi</p>
            )}
        </Drawer>
    );
    
};
export default TaskDrawer;