<?php
/*
Plugin Name: StatsFC Poll
Plugin URI: https://statsfc.com/poll
Description: StatsFC Poll
Version: 2.0.1
Author: Will Woodward
Author URI: https://willjw.co.uk
License: GPL2
*/

/*  Copyright 2020  Will Woodward  (email : will@willjw.co.uk)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

define('STATSFC_POLL_ID',      'StatsFC_Poll');
define('STATSFC_POLL_NAME'  ,  'StatsFC Poll');
define('STATSFC_POLL_VERSION', '2.0.1');

/**
 * Adds widget
 */
class StatsFC_Poll extends WP_Widget
{
    public $isShortcode = false;

    private static $count = 0;

    private static $defaults = array(
        'title'       => '',
        'key'         => '',
        'question_id' => '',
        'omit_errors' => false,
    );

    private static $whitelist = array(
        'question_id',
        'omitErrors',
        'lang',
    );

    /**
     * Register widget with WordPress
     */
    public function __construct()
    {
        parent::__construct(STATSFC_POLL_ID, STATSFC_POLL_NAME, array('description' => 'StatsFC Poll'));
    }

    /**
     * Back-end widget form
     *
     * @see WP_Widget::form()
     *
     * @param array $instance Previously saved values from database
     */
    public function form($instance)
    {
        $instance    = wp_parse_args((array) $instance, self::$defaults);
        $title       = strip_tags($instance['title']);
        $key         = strip_tags($instance['key']);
        $question_id = strip_tags($instance['question_id']);
        $omit_errors = strip_tags($instance['omit_errors']);
        ?>
        <p>
            <label>
                <?php _e('Title', STATSFC_POLL_ID); ?>
                <input class="widefat" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>">
            </label>
        </p>
        <p>
            <label>
                <?php _e('Key', STATSFC_POLL_ID); ?>
                <input class="widefat" name="<?php echo $this->get_field_name('key'); ?>" type="text" value="<?php echo esc_attr($key); ?>">
            </label>
        </p>
        <p>
            <label>
                <?php _e('Poll ID', STATSFC_POLL_ID); ?>
                <input class="widefat" name="<?php echo $this->get_field_name('question_id'); ?>" type="text" value="<?php echo esc_attr($question_id); ?>">
            </label><br>
            Add a poll from your StatsFC account
        </p>
        <p>
            <label>
                <?php _e('Omit error messages?', STATSFC_POLL_ID); ?>
                <input type="checkbox" name="<?php echo $this->get_field_name('omit_errors'); ?>"<?php echo ($omit_errors == 'on' ? ' checked' : ''); ?>>
            </label>
        </p>
    <?php
    }

    /**
     * Sanitize widget form values as they are saved
     *
     * @see WP_Widget::update()
     *
     * @param array $new_instance Values just sent to be saved
     * @param array $old_instance Previously saved values from database
     *
     * @return array Updated safe values to be saved
     */
    public function update($new_instance, $old_instance)
    {
        $instance                = $old_instance;
        $instance['title']       = strip_tags($new_instance['title']);
        $instance['key']         = strip_tags($new_instance['key']);
        $instance['question_id'] = strip_tags($new_instance['question_id']);
        $instance['omit_errors'] = strip_tags($new_instance['omit_errors']);

        return $instance;
    }

    /**
     * Front-end display of widget
     *
     * @see WP_Widget::widget()
     *
     * @param array $args     Widget arguments
     * @param array $instance Saved values from database
     */
    public function widget($args, $instance)
    {
        extract($args);

        $title       = apply_filters('widget_title', (array_key_exists('title', $instance) ? $instance['title'] : ''));
        $unique_id   = ++static::$count;
        $key         = (array_key_exists('key', $instance) ? $instance['key'] : '');
        $referer     = (array_key_exists('HTTP_HOST', $_SERVER) ? $_SERVER['HTTP_HOST'] : '');

        $options = array(
            'question_id' => (array_key_exists('question_id', $instance) ? (int) $instance['question_id'] : 0),
            'omitErrors'  => (array_key_exists('omit_errors', $instance) && filter_var($instance['omit_errors'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false'),
            'lang'        => substr(get_bloginfo('language'), 0, 2),
        );

        $html = '';

        if (isset($before_widget)) {
            $html .= $before_widget;
        }

        if (isset($before_title)) {
            $html .= $before_title;
        }

        $html .= $title;

        if (isset($after_title)) {
            $html .= $after_title;
        }

        $html .= '<div id="statsfc-poll-' . $unique_id . '"></div>' . PHP_EOL;

        if (isset($after_widget)) {
            $html .= $after_widget;
        }

        // Enqueue CSS
        wp_enqueue_style(STATSFC_POLL_ID, plugins_url('poll.css', __FILE__), null, STATSFC_POLL_VERSION);

        // Enqueue base JS
        wp_enqueue_script(STATSFC_POLL_ID, plugins_url('poll.js', __FILE__), array('jquery'), STATSFC_POLL_VERSION, true);

        // Enqueue widget JS
        $object = 'statsfc_poll_' . $unique_id;

        $script  = '<script>' . PHP_EOL;
        $script .= 'var ' . $object . ' = new StatsFC_Poll(' . json_encode($key) . ');' . PHP_EOL;
        $script .= $object . '.referer = ' . json_encode($referer) . ';' . PHP_EOL;

        foreach (static::$whitelist as $parameter) {
            if (! array_key_exists($parameter, $options)) {
                continue;
            }

            $script .= $object . '.' . $parameter . ' = ' . json_encode($options[$parameter]) . ';' . PHP_EOL;
        }

        $script .= $object . '.display("statsfc-poll-' . $unique_id . '");' . PHP_EOL;
        $script .= '</script>';

        add_action('wp_print_footer_scripts', function () use ($script) {
            echo $script;
        });

        if ($this->isShortcode) {
            return $html;
        } else {
            echo $html;
        }
    }

    public static function shortcode($atts)
    {
        $args = shortcode_atts(self::$defaults, $atts);

        $widget              = new self;
        $widget->isShortcode = true;

        return $widget->widget(array(), $args);
    }
}

// Register StatsFC widget
add_action('widgets_init', function () {
    register_widget(STATSFC_POLL_ID);
});

add_shortcode('statsfc-poll', STATSFC_POLL_ID . '::shortcode');
