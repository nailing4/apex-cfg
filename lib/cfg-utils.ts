export interface VideoConfig {
  "setting.cl_gib_allow": string;
  "setting.cl_particle_fallback_base": string;
  "setting.cl_particle_fallback_multiplier": string;
  "setting.cl_ragdoll_maxcount": string;
  "setting.cl_ragdoll_self_collision": string;
  "setting.mat_forceaniso": string;
  "setting.mat_mip_linear": string;
  "setting.stream_memory": string;
  "setting.mat_picmip": string;
  "setting.particle_cpu_level": string;
  "setting.r_createmodeldecals": string;
  "setting.r_decals": string;
  "setting.r_lod_switch_scale": string;
  "setting.shadow_enable": string;
  "setting.shadow_depth_dimen_min": string;
  "setting.shadow_depth_upres_factor_max": string;
  "setting.shadow_maxdynamic": string;
  "setting.ssao_enabled": string;
  "setting.ssao_downsample": string;
  "setting.dvs_enable": string;
  "setting.dvs_gpuframetime_min": string;
  "setting.dvs_gpuframetime_max": string;
  "setting.sound_volume": string;
  "setting.last_display_width": string;
  "setting.last_display_height": string;
  "setting.nowindowborder": string;
  "setting.fullscreen": string;
  "setting.defaultres": string;
  "setting.defaultresheight": string;
  "setting.volumetric_lighting": string;
  "setting.volumetric_fog": string;
  "setting.mat_vsync_mode": string;
  "setting.mat_backbuffer_count": string;
  "setting.mat_antialias_mode": string;
  "setting.csm_enabled": string;
  "setting.csm_coverage": string;
  "setting.csm_cascade_res": string;
  "setting.fadeDistScale": string;
  "setting.dvs_supersample_enable": string;
  "setting.new_shadow_settings": string;
  "setting.gamma": string;
  "setting.configversion": string;
  "setting.dx_version_check_timestamp": string;
  "setting.set_dress_level": string;
}

export const defaultConfig: VideoConfig = {
  "setting.cl_gib_allow": "0",
  "setting.cl_particle_fallback_base": "3",
  "setting.cl_particle_fallback_multiplier": "2",
  "setting.cl_ragdoll_maxcount": "0",
  "setting.cl_ragdoll_self_collision": "0",
  "setting.mat_forceaniso": "1",
  "setting.mat_mip_linear": "0",
  "setting.stream_memory": "160000",
  "setting.mat_picmip": "1",
  "setting.particle_cpu_level": "0",
  "setting.r_createmodeldecals": "0",
  "setting.r_decals": "0",
  "setting.r_lod_switch_scale": "0.6",
  "setting.shadow_enable": "0",
  "setting.shadow_depth_dimen_min": "0",
  "setting.shadow_depth_upres_factor_max": "0",
  "setting.shadow_maxdynamic": "0",
  "setting.ssao_enabled": "0",
  "setting.ssao_downsample": "3",
  "setting.dvs_enable": "0",
  "setting.dvs_gpuframetime_min": "15000",
  "setting.dvs_gpuframetime_max": "16500",
  "setting.sound_volume": "0.5",
  "setting.last_display_width": "2560",
  "setting.last_display_height": "1600",
  "setting.nowindowborder": "0",
  "setting.fullscreen": "1",
  "setting.defaultres": "2560",
  "setting.defaultresheight": "1600",
  "setting.volumetric_lighting": "0",
  "setting.volumetric_fog": "0",
  "setting.mat_vsync_mode": "0",
  "setting.mat_backbuffer_count": "1",
  "setting.mat_antialias_mode": "12",
  "setting.csm_enabled": "0",
  "setting.csm_coverage": "0",
  "setting.csm_cascade_res": "0",
  "setting.fadeDistScale": "1.000000",
  "setting.dvs_supersample_enable": "0",
  "setting.new_shadow_settings": "0",
  "setting.gamma": "1.000000",
  "setting.configversion": "8",
  "setting.dx_version_check_timestamp": "0",
  "setting.set_dress_level": "1",
};

export function generateCfgString(config: VideoConfig): string {
  let cfg = '"VideoConfig"\n{\n';
  
  // Special logic for mat_mip_linear based on mat_forceaniso
  const forceAniso = parseInt(config["setting.mat_forceaniso"]);
  const mipLinear = forceAniso > 1 ? "1.0" : "0";
  const updatedConfig = { ...config, "setting.mat_mip_linear": mipLinear };

  for (const [key, value] of Object.entries(updatedConfig)) {
    cfg += `\t"${key}"\t\t"${value}"\n`;
  }
  
  cfg += "}";
  return cfg;
}

export function downloadCfg(config: VideoConfig) {
  const cfgString = generateCfgString(config);
  const blob = new Blob([cfgString], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'videoconfig.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadInstallScript() {
  const script = `@echo off
set "TARGET_DIR=%LOCALAPPDATA%\\Respawn\\Apex\\local"
set "FILE_NAME=videoconfig.txt"

echo [APEX 战术配置管理器] 正在部署...

if not exist "%TARGET_DIR%" (
    echo [错误] 未找到 Apex 配置目录: %TARGET_DIR%
    pause
    exit /b
)

if not exist "%FILE_NAME%" (
    echo [错误] 请先下载 %FILE_NAME% 并将其放在此脚本所在的文件夹中。
    pause
    exit /b
)

echo 正在移动文件到: %TARGET_DIR%
copy /y "%FILE_NAME%" "%TARGET_DIR%\\%FILE_NAME%"

echo 正在设置文件为只读...
attrib +r "%TARGET_DIR%\\%FILE_NAME%"

echo [成功] 配置已部署并设置为只读！
pause
`;
  const blob = new Blob([script], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'install_apex_cfg.bat';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
