var objectPositionAndJump = {
    Goose: [[2, 3], 10],
    Fox: [[3, 3.6], 8],
    Bean: [[0.4, 2.35], 12.5],
}

var state = {
    marginRaftIs: 0,
    objectsInMargin: [
        ['Raft', 'Fox', 'Bean', 'Goose'],
        ['Raft']
    ],
}

var stateLog = []
var inAnimation = false

function ggbOnInit() {
    console.log('Foi')
    ggbApplet.registerClickListener(click)
    start()
}

function click(clickedName) {
    if (inAnimation) return

    if (clickedName == 'Blackout' || clickedName == 'Restart')
        start()
    else if (clickedName == 'Help')
        help()

    if (state.objectsInMargin[state.marginRaftIs].includes(clickedName))
        moveRaft(clickedName)

}

async function moveRaft(objectName) {
    inAnimation = true

    if (state.marginRaftIs == 0)
        for (let i = 0; i < 80; i++) {
            ggbApplet.setCoords('R_0', 4 + i / 20, 2)
            if (objectName != 'Raft')
                ggbApplet.setCoords(`${objectName.charAt(0)}_0`, 6 + i / 20, 3)
            await new Promise(resolve => setTimeout(resolve, 50))
        }
    else
        for (let i = 0; i < 80; i++) {
            ggbApplet.setCoords('R_0', 8 - i / 20, 2)
            if (objectName != 'Raft')
                ggbApplet.setCoords(`${objectName.charAt(0)}_0`, 10 - i / 20, 3)
            await new Promise(resolve => setTimeout(resolve, 50))
        }

    if (objectName != 'Raft') {
        state.objectsInMargin[state.marginRaftIs].splice(
            state.objectsInMargin[state.marginRaftIs].indexOf(objectName), 1);
        state.marginRaftIs = state.marginRaftIs === 0 ? 1 : 0
        state.objectsInMargin[state.marginRaftIs].push(objectName)
    }
    else
        state.marginRaftIs = state.marginRaftIs === 0 ? 1 : 0

    organizeWithState()
    isEndGame()
    stateLog.push(state)

    inAnimation = false

}

function isEndGame() {
    objects = state.objectsInMargin[state.marginRaftIs == 0 ? 1 : 0]
    if (objects.includes('Fox') && objects.includes('Goose'))
        showMessage('Você Perdeu!', 'A Raposa comeu o Ganso.')
    else if (objects.includes('Goose') && objects.includes('Bean'))
        showMessage('Você Perdeu!', 'O Ganso comeu o Feijão.')

    if (state.objectsInMargin[1].length == 4)
        showMessage('Você Ganhou!', `Chico teve que atravessar \n${stateLog.length} vezes o rio .`)
}

function showMessage(title = '', subtitle = '') {
    ggbApplet.setVisible('Blackout', true)

    ggbApplet.setVisible('Title', true)
    ggbApplet.setTextValue('Title', title)

    ggbApplet.setVisible('Subtitle', true)
    ggbApplet.setTextValue('Subtitle', subtitle)
}

function start() {
    ggbApplet.setVisible('Blackout', false)
    ggbApplet.setVisible('Title', false)
    ggbApplet.setVisible('Subtitle', false)
    ggbApplet.setVisible('HelpMessage', false)

    state = {
        marginRaftIs: 0,
        objectsInMargin: [
            ['Raft', 'Fox', 'Bean', 'Goose'],
            ['Raft']
        ],
    }

    stateLog = []
    organizeWithState()
}

function help() {
    ggbApplet.setVisible('Blackout', true)
    ggbApplet.setVisible('HelpMessage', true)

}

function organizeWithState() {
    state.objectsInMargin.forEach((objects, margin) => {
        objects.forEach(objectName => {
            if (objectName != 'Raft')
                ggbApplet.setCoords(`${objectName.charAt(0)}_0`,
                    objectPositionAndJump[objectName][0][0] + margin * objectPositionAndJump[objectName][1], //x
                    objectPositionAndJump[objectName][0][1] //y
                )
        })
    })
    ggbApplet.setCoords('R_0', 4 + 4 * state.marginRaftIs, 2)
}