<?php
// mod/ecoliplugin/ajax_update.php

require_once('../../config.php');
require_once($CFG->dirroot . '/mod/ecoliplugin/lib.php');

header('Content-Type: application/json');

$id = required_param('id', PARAM_INT);
$score = required_param('score', PARAM_FLOAT);

$cm = get_coursemodule_from_instance('ecoliplugin', $id, 0, false, MUST_EXIST);
$course = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
require_login($course, true, $cm);

$result = ecoliplugin_save_score($cm->instance, $USER->id, $score);

echo json_encode(array('success' => $result));

