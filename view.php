<?php
// mod/ecoliplugin/view.php

require_once('../../config.php');
require_once($CFG->dirroot . '/mod/ecoliplugin/lib.php');

$id = required_param('id', PARAM_INT); // Course module ID.
$cm = get_coursemodule_from_id('ecoliplugin', $id, 0, false, MUST_EXIST);
$course = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
$ecoliplugin = $DB->get_record('ecoliplugin', array('id' => $cm->instance), '*', MUST_EXIST);

require_login($course, true, $cm);

$PAGE->set_url(new moodle_url('/mod/ecoliplugin/view.php', array('id' => $cm->id)));
$PAGE->set_title(format_string($ecoliplugin->name));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context(context_module::instance($cm->id));

// Nustatome grįžimo URL į bandymų sąrašo puslapį – čia rodysime bandymų sąrašą.
// Jei norite grįžti į indeksą, pakeiskite URL.
$returnurl = new moodle_url('/mod/ecoliplugin/view.php', array('id' => $cm->id));

// Include plugin CSS.
$PAGE->requires->css(new moodle_url('/mod/ecoliplugin/code/style.css'));

echo $OUTPUT->header();

// Jei URL turi launch=1, rodykite žaidimo sąsają; kitu atveju – bandymų sąrašą.
$launch = optional_param('launch', 0, PARAM_INT);

if ($launch) {
    // Perduodame instance ID ir grįžimo URL į JavaScript.
    ?>
    <!-- Game interface -->
    <div class="ecoliplugin-container">
      <div id="game-interface">
        <!-- Start screen: rodoma, kol neįvesta pradinė temperatūra -->
        <div id="start-screen" class="start-screen">
          <h1>Pradėkite auginti E. coli koloniją</h1>
          <label for="initial-temperature">Pasirinkite pradinę temperatūrą:</label>
          <input type="number" id="initial-temperature" min="-10" max="50" required>
          <button id="start-game">Pradėti žaidimą</button>
        </div>

        <!-- Game container: iš pradžių paslėptas -->
        <div id="game-container" style="display:none;">
          <div id="background-wrapper"></div>
          <div id="threejs-container"></div>
          <div id="thermometer-container"></div>
          <div class="info-panel">
            Minučių skaičius: <span id="day-counter"></span><br>
            Augimo faktorius: <span id="growth-factor"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Perduodame kintamuosius į JavaScript -->
    <script>
      window.ECOLIPLUGIN_INSTANCE_ID = <?php echo $ecoliplugin->id; ?>;
      window.ECOLIPLUGIN_RETURN_URL = "<?php echo $returnurl; ?>";
    </script>

    <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/"
      }
    }
    </script>

    <!-- Įkelkite žaidimo JavaScript -->
    <script type="module" src="<?php echo $CFG->wwwroot; ?>/mod/ecoliplugin/code/main.js"></script>
    <?php
} else {
    // Rodyti bandymų (attempts) sąrašą.
    echo $OUTPUT->heading("Bandymai");

    // Iškviečiame funkciją, kuri rodo bandymų lentelę.
    ecoliplugin_show_attempts($ecoliplugin, $cm, $course);

    // Mygtukas naujam bandymui (paleidžia žaidimo sąsają).
    $gameurl = new moodle_url('/mod/ecoliplugin/view.php', array('id' => $cm->id, 'launch' => 1));
    echo html_writer::link($gameurl, "Bandyti", array('class' => 'btn btn-primary'));
}

echo $OUTPUT->footer();
?>

