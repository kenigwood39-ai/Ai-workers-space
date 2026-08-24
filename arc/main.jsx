import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { 
  Briefcase, 
  UserCheck, 
  PlusCircle, 
  MessageSquare, 
  Sparkles, 
  Coins, 
  Send, 
  SlidersHorizontal,
  ChevronRight,
  Bot,
  Zap,
  CheckCircle2,
  Paperclip,
  RefreshCw,
  Database
} from 'lucide-react';

const SUPABASE_URL = 'https://kxesopofbqwrnzohnbqs.supabase.co';
const SUPABASE_ANON_KEY = 'Sb_publishable_yOkm8byVqjmQZHvvVKIE6Q_Zx324mjy';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CREATORS = [
  {
    id: 1,
    name: 'Алексей "PromptMaster"',
    rating: '4.98',
    deals: 64,
    skills: ['Midjourney', 'FLUX.1', 'ComfyUI'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    name: 'Elena Synthetica',
    rating: '5.00',
    deals: 92,
    skills: ['Runway Gen-3', 'Luma Dream', 'ElevenLabs'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [userRole, setUserRole] = useState('freelancer');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTool, setFilterTool] = useState('All');
  
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newTool, setNewTool] = useState('Midjourney v6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (data) setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setMessages(data);
      } else {
        setMessages([
          { id: 1, sender: 'Алексей "PromptMaster"', text: 'Готов протестировать генерацию по вашей задаче!', is_me: false }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMessages();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle || !newBudget) return;

    setIsSubmitting(true);
    const newTask = {
      title: newTitle,
      prompt: newPrompt || 'Техническое задание будет предоставлено исполнителю',
      tools: [newTool],
      budget: Number(newBudget),
      currency: 'AWS',
      author: 'Вы (Заказчик)',
      role: 'Заказчик',
      status: 'open',
      preview_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
    };

    const { error } = await supabase.from('tasks').insert([newTask]);
    setIsSubmitting(false);

    if (!error) {
      setNewTitle('');
      setNewPrompt('');
      setNewBudget('');
      setActiveTab('feed');
      fetchTasks();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = { sender: 'Вы', text: chatInput, is_me: true };
    await supabase.from('messages').insert([newMessage]);
    setChatInput('');
    fetchMessages();
  };

  const filteredTasks = filterTool === 'All' 
    ? tasks 
    : tasks.filter(t => t.tools && t.tools.some(tool => tool.toLowerCase().includes(filterTool.toLowerCase())));

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#07090E]/80 border-b border-cyan-500/20 px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-[1px]">
              <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-400 bg-clip-text text-transparent">
                AI WORKERS SPACE
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span className="text-[10px] text-emerald-400/90 font-mono uppercase">
                  Supabase Live DB
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono">
              <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-slate-300">Баланс:</span>
              <span className="text-cyan-300 font-bold">1,450 AWS</span>
            </div>

            <button
              onClick={() => setUserRole(userRole === 'freelancer' ? 'client' : 'freelancer')}
              className="px-3 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 bg-cyan-500/10"
            >
              {userRole === 'client' ? <Briefcase className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              <span>{userRole === 'client' ? 'Заказчик' : 'Исполнитель'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
              activeTab === 'feed' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Лента заказов</span>
            <span className="ml-auto text-xs bg-cyan-950 px-2 py-0.5 rounded-full text-cyan-300 font-mono hidden lg:inline">{tasks.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
              activeTab === 'create' ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-fuchsia-400" />
            <span>Разместить таск</span>
          </button>

          <button
            onClick={() => setActiveTab('creators')}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
              activeTab === 'creators' ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>Топ Креаторов</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
              activeTab === 'chat' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Сделки и Чат</span>
          </button>
        </aside>

        <section className="lg:col-span-9 space-y-5">
          {activeTab === 'feed' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {['All', 'Midjourney', 'Stable Diffusion', 'FLUX'].map((tool) => (
                    <button
                      key={tool}
                      onClick={() => setFilterTool(tool)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        filterTool === tool ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
                <button onClick={fetchTasks} className="text-xs text-cyan-400 flex items-center gap-1.5 font-mono">
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Обновить</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-20 bg-slate-950/40 rounded-2xl border border-slate-800 font-mono text-cyan-400 animate-pulse">
                  Загрузка базы данных Supabase...
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="bg-[#0D121F]/90 p-5 rounded-2xl border border-slate-800/80 hover:border-cyan-500/50 flex flex-col md:flex-row gap-5 items-start md:items-center">
                      <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-950 flex-shrink-0">
                        <img src={task.preview_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <h3 className="font-bold text-base text-slate-100 truncate">{task.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                          <span className="text-cyan-400">Prompt: </span>{task.prompt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{task.author || 'Заказчик'}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-mono">ID: #{task.id}</span>
                        </div>
                      </div>
                      <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3">
                        <div className="font-mono text-lg font-extrabold text-cyan-400">{task.budget} {task.currency || 'AWS'}</div>
                        <button onClick={() => setActiveTab('chat')} className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs">
                          Взять заказ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'create' && (
            <div className="bg-[#0D121F] p-6 sm:p-8 rounded-2xl border border-cyan-500/30">
              <h2 className="text-xl font-bold text-cyan-400 mb-1">Создать задание (Live DB)</h2>
              <p className="text-xs text-slate-400 mb-6">Задача мгновенно сохранится в базу данных Supabase.</p>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Название проекта"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none"
                  >
                    <option value="Midjourney v6">Midjourney v6</option>
                    <option value="FLUX.1">FLUX.1</option>
                    <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Бюджет (AWS)"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Вставьте рабочий промпт или требования..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold text-sm"
                >
                  {isSubmitting ? 'Сохранение...' : 'Опубликовать заказ'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="bg-[#0D121F] rounded-2xl border border-cyan-500/30 overflow-hidden flex flex-col h-[520px]">
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold">Алексей "PromptMaster"</span>
                <span className="text-xs text-teal-400 font-mono">Escrow: Холд 250 AWS</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.is_me ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${msg.is_me ? 'bg-cyan-600 text-white' : 'bg-slate-900 border border-slate-800'}`}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Напишите сообщение..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="p-2.5 bg-cyan-500 text-black rounded-xl"><Send className="w-4 h-4" /></button>
              </form>
            </div>
          )}

          {activeTab === 'creators' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CREATORS.map((creator) => (
                <div key={creator.id} className="bg-[#0D121F] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={creator.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-sm">{creator.name}</h3>
                      <span className="text-xs text-slate-400 font-mono">{creator.deals} сделок • ★ {creator.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {creator.skills.map(s => <span key={s} className="text-[10px] bg-slate-900 px-2 py-1 rounded text-cyan-300 border border-slate-800">{s}</span>)}
                  </div>
                  <button onClick={() => setActiveTab('chat')} className="w-full py-2 bg-slate-900 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold">
                    Написать
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
