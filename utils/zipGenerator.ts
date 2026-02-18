import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { PluginConfig } from '../types';
import {
  generatePHPMain,
  generateShortcodePHP,
  generateAdminPHP,
  generateCSS,
  generateJS,
  generateReadme
} from './pluginTemplates';

export const downloadPlugin = async (config: PluginConfig) => {
  const zip = new JSZip();
  const rootFolder = zip.folder(config.pluginSlug);

  if (!rootFolder) return;

  // Root files
  rootFolder.file(`${config.pluginSlug}.php`, generatePHPMain(config));
  rootFolder.file('uninstall.php', `<?php if (!defined('WP_UNINSTALL_PLUGIN')) exit; delete_option('sct_target_date'); delete_option('sct_target_time'); delete_option('sct_style'); ?>`);
  rootFolder.file('README.txt', generateReadme(config));

  // Includes
  const includes = rootFolder.folder('includes');
  if (includes) {
    includes.file('admin-settings.php', generateAdminPHP(config));
    includes.file('shortcode.php', generateShortcodePHP(config));
  }

  // Assets
  const assets = rootFolder.folder('assets');
  if (assets) {
    const css = assets.folder('css');
    if (css) css.file('style.css', generateCSS(config));
    
    const js = assets.folder('js');
    if (js) js.file('script.js', generateJS());
  }

  // Generate ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Handle file-saver import consistency
  // @ts-ignore
  const saveAs = FileSaver.saveAs || FileSaver;
  saveAs(content, `${config.pluginSlug}.zip`);
};