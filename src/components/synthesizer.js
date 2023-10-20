import { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function Synthesizer( { filteredApiData, data } ) {
    const [synth, setSynth] = useState({});
    // thanks to GuitarLand https://www.guitarland.com/MusicTheoryWithToneJS/PlayMajorScale.html
    const MIDI_SHARP_NAMES = ['B#_0',  'C#_1', 'Cx_1', 'D#_1',   'E_1',  'E#_1',  'F#_1', 'Fx_1',  'G#_1', 'Gx_1', 'A#_1', 'B_1',
                'B#_1', 'C#0', 'Cx0', 'D#0', 'E0', 'E#0', 'F#0', 'Fx0', 'G#0', 'Gx0', 'A#0', 'B0',
                'B#0', 'C#1', 'Cx1', 'D#1', 'E1', 'E#1', 'F#1', 'Fx1', 'G#1', 'Gx1', 'A#1', 'B1',
                'B#1', 'C#2', 'Cx2', 'D#2', 'E2', 'E#2', 'F#2', 'Fx2', 'G#2', 'Gx2', 'A#2', 'B2',
                'B#2', 'C#3', 'Cx3', 'D#3', 'E3', 'E#3', 'F#3', 'Fx3', 'G#3', 'Gx3', 'A#3', 'B3',
                'B#3', 'C#4', 'Cx4', 'D#4', 'E4', 'E#4', 'F#4', 'Fx4', 'G#4', 'Gx4', 'A#4', 'B4',
                'B#4', 'C#5', 'Cx5', 'D#5', 'E5', 'E#5', 'F#5', 'Fx5', 'G#5', 'Gx5', 'A#5', 'B5',
                'B#5', 'C#6', 'Cx6', 'D#6', 'E6', 'E#6', 'F#6', 'Fx6', 'G#6', 'Gx6', 'A#6', 'B6',
                'B#6', 'C#7', 'Cx7', 'D#7', 'E7', 'E#7', 'F#7', 'Fx7', 'G#7', 'Gx7', 'A#7', 'B7',
                'B#7', 'C#8', 'Cx8', 'D#8', 'E8', 'E#8', 'F#8', 'Fx8', 'G#8', 'Gx8', 'A#8', 'B8',
                'B#8', 'C#9', 'Cx9', 'D#9', 'E9', 'E#9', 'F#9', 'Fx9'];
    const MIDI_FLAT_NAMES = ['C_1', 'Db_1', 'D_1', 'Eb_1', 'Fb_1', 'F_1', 'Gb_1', 'G_1', 'Ab_1', 'A_1', 'Bb_1', 'Cb0',
                'C0', 'Db0', 'D0', 'Eb0', 'Fb0', 'F0', 'Gb0', 'G0', 'Ab0', 'A0', 'Bb0', 'Cb1',
                'C1', 'Db1', 'D1', 'Eb1', 'Fb1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'Cb2',
                'C2', 'Db2', 'D2', 'Eb2', 'Fb2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'Cb3',
                'C3', 'Db3', 'D3', 'Eb3', 'Fb3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'Cb4',
                'C4', 'Db4', 'D4', 'Eb4', 'Fb4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'Cb5',
                'C5', 'Db5', 'D5', 'Eb5', 'Fb5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'Cb6',
                'C6', 'Db6', 'D6', 'Eb6', 'Fb6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'Cb7',
                'C7', 'Db7', 'D7', 'Eb7', 'Fb7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'Cb8',
                'C8', 'Db8', 'D8', 'Eb8', 'Fb8', 'F8', 'Gb8', 'G8', 'Ab8', 'A8', 'Bb8', 'Cb9',
                'C9', 'Db9', 'D9', 'Eb9', 'Fb9', 'F9', 'Gb9', 'G9'];

    function noteNameToMIDI(noteName)  {
        var k;
        var MIDInumber = -1; // default if not found
        // check both arrays for the noteName
        for(k = 0; k < MIDI_SHARP_NAMES.length; k++) {
            if( noteName === MIDI_SHARP_NAMES[k] ||
                    noteName === MIDI_FLAT_NAMES[k] ) {
                MIDInumber = k;  // found it
            }
        }
        return Number(MIDInumber); // it should be a number already, but...
    }
    
    const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24];

    function makeScale(scaleFormula, keyNameAndOctave) {
        var ALPHA_NAMES = ['A','B','C','D','E','F','G'];
        var startingName = keyNameAndOctave;

        var offset;
        for(var i = 0; i < ALPHA_NAMES.length; i++) {
            if(startingName.includes(ALPHA_NAMES[i])) {
                offset = i;
                break;
            }
        }

        var startingNote = noteNameToMIDI(keyNameAndOctave);
        var myScaleFormula = scaleFormula;

        var madeScale = [];
        for(var j = 0; j < myScaleFormula.length; j++) {
            if(MIDI_SHARP_NAMES[myScaleFormula[j] + startingNote].includes(ALPHA_NAMES[(offset + j) % ALPHA_NAMES.length])) {
                madeScale.push( MIDI_SHARP_NAMES[myScaleFormula[j] + startingNote] );
            } else if(MIDI_FLAT_NAMES[myScaleFormula[j] + startingNote].includes(ALPHA_NAMES[(offset + j) % ALPHA_NAMES.length])) {
                madeScale.push( MIDI_FLAT_NAMES[myScaleFormula[j] + startingNote] );
            } else {
                madeScale.push("C7"); // high note used to indicate error
            }
        }
        console.log(madeScale);
        return madeScale;
    }
     
    const playSynth = () => {
        Tone.start();
        // Create a synth
        // Use the state updater callback form to set the synth state
        setSynth(() => {
            const newSynth = new Tone.Synth().toDestination();
            // const now = Tone.now(); // time keeper
            var patternName = "up";
            var tempo = '60';
            var volume = '-10';
            
            Tone.context.resume().then(() => {
                // if (filteredApiData.length) {
                    // Ab, A, Bb, B, Cb, C, C#, Db, D, Eb, E, F, F#, Gb, G
                    var scale = makeScale(MAJOR_SCALE, 'C4'); 
                    // console.log(scale);
                    var pattern = new Tone.Pattern(function(time, note) {
                        newSynth.triggerAttackRelease(note, "4n", time);
                    }, scale, patternName).start(0);
                    console.log(pattern);

                    Tone.Transport.bpm.value = tempo;   
                    newSynth.volume.value = volume;
                    Tone.Transport.start("+0.1");
                // }
            });

            return newSynth;
        });
    }

    useEffect(() => {
        // Use synth in an empty useEffect to prevent the "unused variable" warning
        // console.log(synth);
        console.log(data);
    }, [synth, data]);

    return (
        <>
        <div>   
            <h1>Synthesizer</h1>
            <button onClick={playSynth}>Play Scale</button>
        </div>
        </>
    );
}
