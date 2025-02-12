<?php
defined('MOODLE_INTERNAL') || die();

// Rezultatų įrašymo funkcija
function ecoliplugin_save_score($instanceid, $userid, $score) {
    global $DB;
    $record = new stdClass();
    $record->instanceid   = $instanceid;
    $record->userid       = $userid;
    $record->score        = $score;
    $record->timecreated  = time();
    
    $id = $DB->insert_record('ecoliplugin_results', $record);
    
    if ($id) {
        // Atnaujinti gradebook
        ecoliplugin_grade_item_update($instanceid, $score);
        return true;
    }
    return false;
}

// Balų atnaujinimo funkcija
function ecoliplugin_grade_item_update($instanceid, $score = null) {
    global $CFG;
    require_once($CFG->libdir . '/gradelib.php');
    
    $params = array('itemname' => get_string('modulename', 'ecoliplugin'));
    // Jei jūsų maksimalus balas nėra 100, pakeiskite skaičių žemiau.
    grade_update('mod/ecoliplugin', $instanceid, null, 0, 100, $score, $params);
}

// Funkcija bandymų (attempts) rodymui – pateikiama lentelė
function ecoliplugin_show_attempts($plugin, $cm, $course) {
    global $DB, $OUTPUT;
    // Pakeiskite 'ecoliplugin_results' į tikrą lentelės pavadinimą, jei kitoks.
    $attempts = $DB->get_records('ecoliplugin_results', array('instanceid' => $plugin->id), 'timecreated ASC');
    if (!$attempts) {
        echo $OUTPUT->notification("Nėra atliktų bandymų.");
        return;
    }
    $table = new html_table();
    // Užtikrinkite, kad kalbos failuose yra atitinkami stringai, pvz., 'attempt', 'score' ir 'date'
    $table->head = array(get_string('attempt', 'ecoliplugin'), get_string('score', 'ecoliplugin'), get_string('date', 'ecoliplugin'));
    foreach ($attempts as $attempt) {
        $row = array();
        $row[] = $attempt->id;
        $row[] = $attempt->score;
        $row[] = userdate($attempt->timecreated);
        $table->data[] = $row;
    }
    echo html_writer::table($table);
}
?>

