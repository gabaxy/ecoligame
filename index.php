<?php
// mod/ecoliplugin/index.php

require_once('../../config.php');

$id = required_param('id', PARAM_INT); // Course ID.
$course = $DB->get_record('course', array('id' => $id), '*', MUST_EXIST);

require_course_login($course);
$PAGE->set_url(new moodle_url('/mod/ecoliplugin/index.php', array('id' => $course->id)));
$PAGE->set_title(format_string($course->fullname));
$PAGE->set_heading(format_string($course->fullname));

echo $OUTPUT->header();

if (!$ecoliplugins = get_all_instances_in_course('ecoliplugin', $course)) {
    notice(get_string('noinstances', 'ecoliplugin'), new moodle_url('/course/view.php', array('id' => $course->id)));
}

$table = new html_table();
$table->head = array(get_string('name', 'ecoliplugin'), get_string('intro', 'ecoliplugin'));
foreach ($ecoliplugins as $ecoliplugin) {
    $url = new moodle_url('/mod/ecoliplugin/view.php', array('id' => $ecoliplugin->coursemodule));
    $table->data[] = array(html_writer::link($url, format_string($ecoliplugin->name)),
                           format_module_intro('ecoliplugin', $ecoliplugin, $ecoliplugin->coursemodule));
}
echo html_writer::table($table);

echo $OUTPUT->footer();
