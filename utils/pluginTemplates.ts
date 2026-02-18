import { PluginConfig } from '../types';

export const generatePHPMain = (config: PluginConfig) => `<?php
/**
 * Plugin Name: ${config.pluginName}
 * Description: A professional countdown timer featuring Bar, Banner, and Box layouts.
 * Version: 1.0.0
 * Author: Smart Countdown Generator
 * Text Domain: ${config.pluginSlug}
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'SCT_PATH', plugin_dir_path( __FILE__ ) );
define( 'SCT_URL', plugin_dir_url( __FILE__ ) );

require_once SCT_PATH . 'includes/shortcode.php';

function sct_enqueue_assets() {
    wp_register_style( 'sct-style', SCT_URL . 'assets/css/style.css', array(), '1.0.0' );
    wp_register_script( 'sct-script', SCT_URL . 'assets/js/script.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'sct_enqueue_assets' );

// Auto-inject for Top/Bottom positions if configured
function sct_inject_timer() {
    // Only inject if position is top or bottom, NOT inline
    // This is a simple implementation; normally controlled via settings
    if ( ! is_admin() ) {
        // Example: logic to determine if we should show it globally
        // For this generated plugin, we rely mostly on shortcode, 
        // but if user selected 'top' or 'bottom' in generator, we might want to auto-hook it.
        // For safety, we'll leave it to the user to place the shortcode, 
        // OR we can hook into wp_body_open or wp_footer for top/bottom bars.
    }
}
// add_action('wp_body_open', 'sct_inject_timer');
`;

export const generateShortcodePHP = (config: PluginConfig) => `<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function sct_shortcode_handler( $atts ) {
    wp_enqueue_style( 'sct-style' );
    wp_enqueue_script( 'sct-script' );

    $a = shortcode_atts( array(
        'date'    => '${config.targetDate}',
        'time'    => '${config.targetTime}',
        'action'  => '${config.expiryAction}',
        'message' => '${config.expiryMessage}',
        'url'     => '${config.redirectUrl}',
        'title'   => '${config.titleText}',
        'predate' => '${config.preDateText}',
    ), $atts );

    $datetime = $a['date'] . ' ' . $a['time'];
    $id = 'sct-' . uniqid();
    
    // Layout classes
    $layout_class = 'sct-layout-${config.layout}';
    $position_class = 'sct-pos-${config.position}';

    ob_start();
    ?>
    <div id="<?php echo esc_attr($id); ?>" 
         class="sct-container <?php echo esc_attr($layout_class . ' ' . $position_class); ?>"
         data-date="<?php echo esc_attr($datetime); ?>"
         data-action="<?php echo esc_attr($a['action']); ?>"
         data-url="<?php echo esc_url($a['url']); ?>">
        
        <div class="sct-text-content">
            <?php if ( ! empty( $a['title'] ) && '${config.layout}' === 'banner' ) : ?>
                <div class="sct-title"><?php echo esc_html( $a['title'] ); ?></div>
            <?php endif; ?>
            
            <?php if ( ! empty( $a['predate'] ) ) : ?>
                <div class="sct-pre-date"><?php echo esc_html( $a['predate'] ); ?></div>
            <?php endif; ?>
        </div>

        <div class="sct-timer">
            <?php if(${config.showDays}): ?>
            <div class="sct-box">
                <span class="sct-number sct-days">00</span>
                <span class="sct-label">${config.layout === 'bar' ? 'Days' : 'Days'}</span>
            </div>
            <?php endif; ?>
            
            <?php if(${config.showHours}): ?>
            <div class="sct-box">
                <span class="sct-number sct-hours">00</span>
                <span class="sct-label">${config.layout === 'bar' ? 'Hr' : 'Hours'}</span>
            </div>
            <?php endif; ?>
            
            <?php if(${config.showMinutes}): ?>
            <div class="sct-box">
                <span class="sct-number sct-minutes">00</span>
                <span class="sct-label">${config.layout === 'bar' ? 'Min' : 'Minutes'}</span>
            </div>
            <?php endif; ?>
            
            <?php if(${config.showSeconds}): ?>
            <div class="sct-box">
                <span class="sct-number sct-seconds">00</span>
                <span class="sct-label">${config.layout === 'bar' ? 'Sec' : 'Seconds'}</span>
            </div>
            <?php endif; ?>
        </div>
        
        <div class="sct-expiry-message" style="display: none;">
            <?php echo esc_html( $a['message'] ); ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'smart_countdown', 'sct_shortcode_handler' );
`;

export const generateAdminPHP = (config: PluginConfig) => `<?php
// Minimal admin to allow date changes if needed, 
// though the generator approach emphasizes pre-configuration.
if ( ! defined( 'ABSPATH' ) ) exit;
`;

export const generateCSS = (config: PluginConfig) => `
/* Base Container */
.sct-container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    width: 100%;
    max-width: ${config.layout === 'box' ? '600px' : '100%'};
    background-color: ${config.backgroundColor};
    color: ${config.textColor};
    display: flex;
    align-items: center;
    justify-content: ${config.layout === 'box' ? 'center' : 'space-between'};
    padding: ${config.layout === 'bar' ? '12px 24px' : '24px 32px'};
    border-radius: ${config.layout === 'box' ? '16px' : '0'};
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    position: relative;
    flex-wrap: wrap;
    gap: 20px;
    box-sizing: border-box;
    margin: 0 auto;
}

/* Positioning */
.sct-pos-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    border-radius: 0;
    max-width: 100% !important;
}
.sct-pos-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    border-radius: 0;
    max-width: 100% !important;
}

/* Layout Specifics */
.sct-layout-bar { flex-direction: row; }
.sct-layout-banner { flex-direction: row; }
.sct-layout-box { flex-direction: column; text-align: center; }

/* Text Content */
.sct-text-content {
    display: flex;
    flex-direction: ${config.layout === 'box' ? 'column' : 'row'};
    align-items: center;
    gap: 12px;
    font-weight: 600;
}
.sct-title {
    font-size: ${config.layout === 'bar' ? '1.1rem' : '1.5rem'};
    line-height: 1.2;
    font-weight: 700;
}
.sct-pre-date {
    font-size: 1rem;
    opacity: 0.9;
}

/* Timer Flex */
.sct-timer {
    display: flex;
    align-items: center;
    gap: ${config.layout === 'bar' ? '8px' : '16px'};
}

/* Digit Box */
.sct-box {
    display: flex;
    flex-direction: ${config.layout === 'bar' ? 'row' : 'column'};
    align-items: center;
    justify-content: center;
    background-color: ${config.numberBackgroundColor};
    color: ${config.numberTextColor};
    padding: ${config.layout === 'bar' ? '6px 12px' : '12px 16px'};
    border-radius: ${config.layout === 'bar' ? '6px' : '8px'};
    min-width: ${config.layout === 'bar' ? 'auto' : '80px'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sct-number {
    font-size: ${config.layout === 'bar' ? '1.1rem' : '2rem'};
    font-weight: 700;
    line-height: 1;
}

.sct-label {
    font-size: ${config.layout === 'bar' ? '0.75rem' : '0.7rem'};
    text-transform: uppercase;
    margin-left: ${config.layout === 'bar' ? '6px' : '0'};
    margin-top: ${config.layout === 'bar' ? '0' : '4px'};
    opacity: 0.8;
    font-weight: 500;
}

/* Expiry Message */
.sct-expiry-message {
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 10px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .sct-container {
        flex-direction: column;
        text-align: center;
        gap: 16px;
        padding: 16px;
        position: relative; /* Reset fixed on mobile if desired, or keep sticky */
        justify-content: center;
    }
    
    .sct-text-content {
        flex-direction: column;
        gap: 4px;
        text-align: center;
    }
    
    .sct-box {
        min-width: ${config.layout === 'bar' ? 'auto' : '60px'};
        padding: ${config.layout === 'bar' ? '6px 10px' : '8px'};
    }
    .sct-number {
        font-size: ${config.layout === 'bar' ? '1rem' : '1.5rem'};
    }
    .sct-label {
        font-size: 0.65rem;
    }
}
`;

export const generateJS = () => `document.addEventListener('DOMContentLoaded', function() {
    const timers = document.querySelectorAll('.sct-container');

    timers.forEach(wrapper => {
        const dateStr = wrapper.getAttribute('data-date');
        const action = wrapper.getAttribute('data-action');
        const redirectUrl = wrapper.getAttribute('data-url');
        
        const targetDate = new Date(dateStr).getTime();
        const timerEl = wrapper.querySelector('.sct-timer');
        const msgEl = wrapper.querySelector('.sct-expiry-message');
        const contentEl = wrapper.querySelector('.sct-text-content');
        
        const daysEl = wrapper.querySelector('.sct-days');
        const hoursEl = wrapper.querySelector('.sct-hours');
        const minsEl = wrapper.querySelector('.sct-minutes');
        const secsEl = wrapper.querySelector('.sct-seconds');

        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                handleExpiry();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if(daysEl) updateNumber(daysEl, days);
            if(hoursEl) updateNumber(hoursEl, hours);
            if(minsEl) updateNumber(minsEl, minutes);
            if(secsEl) updateNumber(secsEl, seconds);
        }

        function updateNumber(element, value) {
            const strVal = value < 10 ? '0' + value : value;
            if (element.innerText !== strVal) {
                element.innerText = strVal;
            }
        }

        function handleExpiry() {
            if (action === 'hide') {
                wrapper.style.display = 'none';
            } else if (action === 'message') {
                if(timerEl) timerEl.style.display = 'none';
                if(contentEl) contentEl.style.display = 'none';
                if(msgEl) msgEl.style.display = 'block';
            } else if (action === 'redirect' && redirectUrl) {
                window.location.href = redirectUrl;
            }
        }

        const interval = setInterval(updateTimer, 1000);
        updateTimer();
    });
});
`;

export const generateReadme = (config: PluginConfig) => `=== ${config.pluginName} ===
Contributors: WP Smart Plugins
Tags: countdown, timer, bar, banner
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
License: GPLv2 or later

A smart, responsive countdown timer with Bar, Banner, and Box layouts.

== Description ==

${config.pluginName} allows you to add professional countdown timers.

**Configuration Used:**
* Layout: ${config.layout}
* Position: ${config.position}
* Target: ${config.targetDate} ${config.targetTime}

== Usage ==

Use the shortcode:
\`[smart_countdown]\`

The plugin is pre-configured with the styles you selected in the generator.
`;