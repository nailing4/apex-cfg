'use client';

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Box, 
  Sun, 
  Layers, 
  Zap, 
  Download, 
  RefreshCw, 
  Terminal,
  Volume2,
  Maximize,
  Settings2,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoConfig, defaultConfig, generateCfgString, downloadCfg } from '@/lib/cfg-utils';

export default function ApexCfgManager() {
  const [config, setConfig] = useState<VideoConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [previewOpen, setPreviewOpen] = useState(true);

  const updateConfig = (key: keyof VideoConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: '基础显示', icon: Monitor },
    { id: 'texture', label: '纹理细节', icon: Box },
    { id: 'shadow', label: '阴影与光照', icon: Sun },
    { id: 'model', label: '模型与特效', icon: Layers },
    { id: 'adaptive', label: '自适应设置', icon: Zap },
  ];

  const renderToggle = (label: string, key: keyof VideoConfig, description?: string) => (
    <div className="flex justify-between items-center p-4 bg-[#1C1B1B] border-l-2 border-transparent hover:border-[#DA292A] transition-all group">
      <div>
        <h4 className="text-sm font-semibold text-white">{label}</h4>
        {description && <p className="text-[10px] text-[#808080] mt-1">{description}</p>}
      </div>
      <button 
        onClick={() => updateConfig(key, config[key] === "0" ? "1" : "0")}
        className={`relative inline-flex h-6 w-11 items-center transition-colors focus:outline-none ${config[key] === "1" ? 'bg-[#DA292A]' : 'bg-[#353534]'}`}
      >
        <span className={`inline-block h-4 w-4 transform bg-white transition-transform ${config[key] === "1" ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const renderSelect = (label: string, key: keyof VideoConfig, options: { label: string, value: string }[], description?: string) => (
    <div className="flex flex-col p-4 bg-[#1C1B1B] border-l-2 border-transparent hover:border-[#DA292A] transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">{label}</h4>
          {description && <p className="text-[10px] text-[#808080] mt-1">{description}</p>}
        </div>
        <span className="text-[10px] font-mono text-[#FFB4AC] bg-[#353534] px-2 py-0.5">{config[key]}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => updateConfig(key, opt.value)}
            className={`text-[10px] py-1.5 px-2 border transition-all ${config[key] === opt.value ? 'bg-[#DA292A] border-[#DA292A] text-white' : 'bg-[#0e0e0e] border-[#353534] text-[#808080] hover:border-[#DA292A]'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderInput = (label: string, key: keyof VideoConfig, type: string = "text", description?: string) => (
    <div className="flex justify-between items-center p-4 bg-[#1C1B1B] border-l-2 border-transparent hover:border-[#DA292A] transition-all">
      <div>
        <h4 className="text-sm font-semibold text-white">{label}</h4>
        {description && <p className="text-[10px] text-[#808080] mt-1">{description}</p>}
      </div>
      <input
        type={type}
        value={config[key]}
        onChange={(e) => updateConfig(key, e.target.value)}
        className="w-24 bg-[#0e0e0e] border border-[#353534] text-xs text-[#FFB4AC] p-1.5 focus:ring-1 focus:ring-[#DA292A] focus:outline-none text-right"
      />
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans selection:bg-[#DA292A] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C1B1B] border-r border-[#2A2A2A] flex flex-col z-20">
        <div className="p-6">
          <h1 className="text-lg font-black text-[#FFB4AC] tracking-tighter font-headline uppercase">战术控制面板</h1>
          <p className="text-[10px] text-[#808080] mt-1 uppercase tracking-widest">Tactical Monolith V1.0</p>
        </div>
        
        <nav className="flex-1 mt-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-6 py-4 transition-all relative group ${activeTab === tab.id ? 'bg-[#2A2A2A] text-[#FFB4AC]' : 'text-[#808080] hover:text-white hover:bg-[#252525]'}`}
            >
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute left-0 top-0 bottom-0 w-1 bg-[#DA292A]" />}
              <tab.icon className={`w-4 h-4 mr-3 ${activeTab === tab.id ? 'text-[#DA292A]' : 'group-hover:text-[#DA292A]'}`} />
              <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 bg-[#131313] mt-auto">
          <button 
            onClick={() => downloadCfg(config)}
            className="w-full py-3 bg-[#DA292A] text-white text-xs font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出 .CFG
          </button>
          <button 
            onClick={() => setConfig(defaultConfig)}
            className="w-full mt-3 py-2 bg-transparent border border-[#353534] text-[#808080] text-[10px] font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            恢复默认
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#131313] relative overflow-hidden">
        <header className="px-8 py-6 flex justify-between items-center border-b border-[#1C1B1B]">
          <div>
            <h2 className="text-xl font-bold text-white font-headline tracking-tight uppercase">
              {tabs.find(t => t.id === activeTab)?.label} <span className="text-[#DA292A]">/</span> <span className="text-[#808080] text-sm">{activeTab.toUpperCase()}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-[#DA292A] animate-pulse" />
              <span className="text-[9px] text-[#808080] uppercase font-bold tracking-widest">System Online</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-5xl"
              >
                {activeTab === 'general' && (
                  <>
                    {renderInput("游戏音量", "setting.sound_volume", "number", "主音量设置 (0.0 - 1.0)")}
                    {renderInput("画面亮度", "setting.gamma", "number", "游戏内 Gamma 值 (默认 1.0)")}
                    {renderInput("分辨率 宽", "setting.last_display_width", "number", "窗口/全屏宽度")}
                    {renderInput("分辨率 高", "setting.last_display_height", "number", "窗口/全屏高度")}
                    {renderToggle("全屏模式", "setting.fullscreen", "开启全屏或窗口化")}
                    {renderToggle("无边框窗口", "setting.nowindowborder", "仅在非全屏下有效")}
                    {renderSelect("垂直同步", "setting.mat_vsync_mode", [
                      { label: "禁用", value: "0" },
                      { label: "双缓冲", value: "1" },
                      { label: "三重缓冲", value: "2" },
                      { label: "自适应", value: "3" },
                      { label: "自适应半刷新", value: "4" },
                    ])}
                    {renderSelect("垂直同步缓冲", "setting.mat_backbuffer_count", [
                      { label: "禁用/双/自适应", value: "1" },
                      { label: "三重缓冲", value: "2" },
                    ])}
                  </>
                )}

                {activeTab === 'texture' && (
                  <>
                    {renderSelect("纹理过滤", "setting.mat_forceaniso", [
                      { label: "双/三线性", value: "1" },
                      { label: "2x", value: "2" },
                      { label: "4x", value: "4" },
                      { label: "8x", value: "8" },
                      { label: "16x", value: "16" },
                    ], "各向异性过滤强度")}
                    {renderSelect("纹理串流预算", "setting.stream_memory", [
                      { label: "无", value: "0" },
                      { label: "很低 (6G)", value: "160000" },
                      { label: "低 (6.5G)", value: "300000" },
                      { label: "中 (7G)", value: "600000" },
                      { label: "高 (8G)", value: "1000000" },
                      { label: "很高 (10G)", value: "2000000" },
                      { label: "超高 (10G+)", value: "3000000" },
                    ])}
                    {renderSelect("纹理质量", "setting.mat_picmip", [
                      { label: "高", value: "0" },
                      { label: "标准", value: "1" },
                      { label: "低", value: "2" },
                    ])}
                    {renderSelect("地图详情", "setting.set_dress_level", [
                      { label: "低", value: "1" },
                      { label: "高", value: "2" },
                    ])}
                  </>
                )}

                {activeTab === 'shadow' && (
                  <>
                    {renderToggle("全局阴影", "setting.shadow_enable", "开启或关闭所有阴影")}
                    {renderSelect("点状阴影细节", "setting.shadow_depth_dimen_min", [
                      { label: "禁用", value: "0" },
                      { label: "低 (128)", value: "128" },
                      { label: "高 (256)", value: "256" },
                      { label: "极高 (512)", value: "512" },
                    ])}
                    {renderSelect("点状阴影倍率", "setting.shadow_depth_upres_factor_max", [
                      { label: "禁用", value: "0" },
                      { label: "低 (2.0)", value: "2.0" },
                      { label: "极高 (3.0)", value: "3.0" },
                    ])}
                    {renderToggle("动态点光源阴影", "setting.shadow_maxdynamic", "启用后消耗较大性能")}
                    {renderToggle("环境光遮蔽", "setting.ssao_enabled", "SSAO 开关")}
                    {renderSelect("环境光等级", "setting.ssao_downsample", [
                      { label: "高", value: "0" },
                      { label: "中", value: "1" },
                      { label: "低", value: "2" },
                      { label: "禁用", value: "3" },
                    ])}
                    {renderToggle("体积光照", "setting.volumetric_lighting", "用于渲染体积雾")}
                    {renderToggle("渲染体积雾", "setting.volumetric_fog", "体积雾开关")}
                    {renderToggle("级联阴影贴图", "setting.csm_enabled", "CSM 开关")}
                    {renderSelect("级联阴影范围", "setting.csm_coverage", [
                      { label: "禁用", value: "0" },
                      { label: "低", value: "1.0" },
                      { label: "高", value: "2.00" },
                    ])}
                    {renderSelect("级联阴影质量", "setting.csm_cascade_res", [
                      { label: "禁用", value: "0" },
                      { label: "低 (512)", value: "512" },
                      { label: "高 (1024)", value: "1024" },
                    ])}
                  </>
                )}

                {activeTab === 'model' && (
                  <>
                    {renderToggle("布娃娃系统", "setting.cl_gib_allow", "肢体破碎效果")}
                    {renderToggle("布娃娃碰撞", "setting.cl_ragdoll_self_collision", "布娃娃物理碰撞")}
                    {renderSelect("布娃娃数量", "setting.cl_ragdoll_maxcount", [
                      { label: "低 (0)", value: "0" },
                      { label: "中 (4)", value: "4" },
                      { label: "高 (8)", value: "8" },
                    ])}
                    {renderSelect("粒子基础数量", "setting.cl_particle_fallback_base", [
                      { label: "低 (3)", value: "3" },
                      { label: "中/高 (0)", value: "0" },
                    ])}
                    {renderSelect("特效细节", "setting.cl_particle_fallback_multiplier", [
                      { label: "高 (1)", value: "1" },
                      { label: "中 (1.75)", value: "1.75" },
                      { label: "低 (2)", value: "2" },
                    ])}
                    {renderSelect("粒子质量", "setting.particle_cpu_level", [
                      { label: "低", value: "0" },
                      { label: "中", value: "1.0" },
                      { label: "高", value: "2.0" },
                    ])}
                    {renderSelect("冲撞痕迹", "setting.r_createmodeldecals", [
                      { label: "禁用/低", value: "0" },
                      { label: "高", value: "1.0" },
                    ])}
                    {renderSelect("冲撞痕迹贴图", "setting.r_decals", [
                      { label: "禁用", value: "0" },
                      { label: "低/高 (256)", value: "256" },
                    ])}
                    {renderSelect("模型细节", "setting.r_lod_switch_scale", [
                      { label: "低 (0.6)", value: "0.6" },
                      { label: "中 (0.8)", value: "0.8" },
                      { label: "高 (1.0)", value: "1.0" },
                    ], "渲染距离与模型精度")}
                    {renderSelect("TSAA抗锯齿", "setting.mat_antialias_mode", [
                      { label: "禁用", value: "0" },
                      { label: "启用", value: "12" },
                    ])}
                  </>
                )}

                {activeTab === 'adaptive' && (
                  <>
                    {renderToggle("自适应分辨率", "setting.dvs_enable", "帧率目标开关")}
                    {renderInput("最小帧生成时间", "setting.dvs_gpuframetime_min", "number", "单位: 微秒")}
                    {renderInput("最大帧生成时间", "setting.dvs_gpuframetime_max", "number", "单位: 微秒")}
                    {renderInput("渲染距离倍率", "setting.fadeDistScale", "number", "通常保持 1.0")}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Preview Panel */}
          <div className={`bg-[#0e0e0e] border-l border-[#1C1B1B] transition-all duration-300 flex flex-col ${previewOpen ? 'w-[400px]' : 'w-0'}`}>
            <div className="p-4 flex justify-between items-center border-b border-[#1C1B1B]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-[#DA292A]" />
                <span className="text-[10px] font-bold text-[#808080] uppercase tracking-widest">videoconfig.cfg 实时预览</span>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="text-[#808080] hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono text-[11px] text-[#c8c6c5] leading-relaxed">
              <pre className="whitespace-pre-wrap">{generateCfgString(config)}</pre>
            </div>
          </div>
          
          {!previewOpen && (
            <button 
              onClick={() => setPreviewOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#DA292A] p-1 text-white z-30"
            >
              <Terminal className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Footer Stats */}
        <footer className="h-12 bg-[#0e0e0e] border-t border-[#1C1B1B] px-8 flex items-center justify-between">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#DA292A]" />
              <span className="text-[9px] text-[#808080] uppercase tracking-tighter">Config Version: <span className="text-white">{config["setting.configversion"]}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFB4AC]" />
              <span className="text-[9px] text-[#808080] uppercase tracking-tighter">DX Version: <span className="text-white">9.0c (Standard)</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[#353534] font-bold uppercase tracking-widest">
            <Info className="w-3 h-3" />
            APEX Tactical Interface // Build 2026.04.06
          </div>
        </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #131313;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #353534;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #DA292A;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
