

export type TaskInput = { title: string; notes?: string};
//id title notesmaybe done createdat
export type Task = {
    id: number;
    title: string;
    notes?: string;
    done: boolean;
    createdat: number;
};

let nextId = 1;
const tasks:Task[] = [];

export function listTasks(): Task[] {
    return tasks.slice().sort((a, b) => b.createdat - a.createdat);
}

// createTask: ttle input&trim check title or error task id++ title, notesinputmaybe or nott sure
//done not createdat now theen push to array then return

export function createTask(input:TaskInput):Task {
    const title = input.title.trim();
    if(!title){
        throw new Error('title required');
    }
    const task:Task = {
        id: nextId++,
        title,
        notes: input.notes?.trim() || undefined,
        done:false,
        createdat: Date.now()
    };
    tasks.push(task);
    return task;
}


export  function getTaskbyId(id:number):Task | undefined {
    return tasks.find((t) => t.id === id);
}

export function updateTask(id: number, patch: Partial<Pick<Task, 'title' | 'notes' | 'done'>>): Task | undefined {
    const t = getTaskbyId(id);
    if(!t){
        return undefined;
    }
    if( patch.title !== undefined ){
        t.title = patch.title;
    }
    if( patch.notes !== undefined ){
        t.notes = patch.notes;
    }
    if( patch.done !== undefined ){
        t.done = patch.done;
    }

    return t;
}


export function deleteTask(id:number): boolean {
    const idx = tasks.findIndex((t) => t.id === id);
    if(idx === -1){
        return false;
    }
    tasks.splice(idx,1);
    return true;

}