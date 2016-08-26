#ifndef SOUND_MANAGER_JS
#define SOUND_MANAGER_JS

function PlaySound(sound, loop) {
    var soundToPlay = null;

    switch(sound) {
        case "music":
            soundToPlay = DX.resource("cb3090406650ce1ab46ad66e903da5bbd299ba7a2760a6e2f36ff57fc53c533e");
            break;
        case "gong":
            soundToPlay = DX.resource("156874dd489061e1888d990e8f84777accc0b5bc63b7115c96c8f6444b080153");
            break;
        case "eat":
            soundToPlay = DX.resource("9dc305427b848392edc98ca85d3a1cb9fdc98fed64f1d0201032f3b7cbc8d638");
            break;
        case "jump":
            soundToPlay = DX.resource("e6c2aca962a71feff5f620dbc83ce448d24aa4ae8042979c3f669d4be23a4716");
            break;
        case "dizzy":
            soundToPlay = DX.resource("4ee1f7b179b7fb38a2cc4d0562eb949db0f9e1f7c8032bd15cb6a383f18ea3ee");
            break;
        case "failKick":
            soundToPlay = DX.resource("7230f2fdfdb95e273a1bafcbed722aa87a84cf4c936932e0737ffc7bb8baee42");
            break;
        case "land":
            soundToPlay = DX.resource("f1e2e3b35d0d85c970c2af512662693473b4a96569666898c4fefba791179d5c");
            break;
        case "receiveKick":
            soundToPlay = DX.resource("ca247fe8acb2ba86717286c1d96f95d06feabc41d3327abc95a8addf816925cd");
            break;
        case "successKick":
            soundToPlay = DX.resource("13925d51bc59c7a55349e5f2180a82e09694c9cf3f5f35675ec0c547af3a78b3");
            break;
    }

    if(soundToPlay != null) {
        soundToPlay.play(loop);
        return soundToPlay;
    } else {
        return null;
    }
}

#endif