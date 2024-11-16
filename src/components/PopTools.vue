<template>
    <div>
		<h1>Try these handy <span class="text-gradient">Tools</span>!</h1>
        <div class="topTools">
            <form class="inputGroup" @submit.prevent="spawnTimer()" :class="{invalid: !newTimerIsValid}">
                <label class="toolName" for="newTimer">Spawn a new timer</label>
                <div class="inputPair">
                    <input type="text" id="newTimer" v-model="newTimerString" placeholder="New Timer" />
                    <input type="submit" value="Go">
                </div>
            </form>
        </div>
        <div class="toolInstances">
            <TransitionGroup name="spawn" @before-leave="beforeLeave">
                <div class="instance" v-for="timer in activeTimers" :key="timer.key" :class="{timerIsDone: timer.isDone}">
                    <p class="timerText">{{ timeLeft(timer.key, forceRefreshKey) }}</p>
                    <div class="instanceActions">
                        <button>Pause</button>
                        <!-- <button>Resume</button> -->
                        <button @click="removeTimer(timer.key)">Remove</button>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type TimerInstance = {
    key: string,
    untilTimestamp: number,
    isDone: boolean,
    isPaused: boolean,
    pausedAt?: number,
}

const newTimerString = ref<string>('')
const newTimerIsValid = computed(() => {
    if (newTimerString.value == '') return true
    const {valid} = formatTime()
    return valid
})
const activeTimers = ref<TimerInstance[]>([])

function formatTime() {
    // must match
    // 10s
    // 10seconds
    // 10sec
    // 10min 10s
    // 1h10m20s
    const badFormatOutput = {
        valid: false,
        hours: 0,
        minutes: 0,
        seconds: 0,
        timeString: "0:0:0",
        totalSeconds: 0,
    }
    const m = newTimerString.value.match(/(\d+\s?(hours|hour|h))?\s?(\d+\s?(minutes|mins|minute|min|m))?\s?(\d+\s?(s|sec|secs|second|seconds))?/)
    if (!m) return badFormatOutput;
    if (!m[0]) return badFormatOutput;
    let h_count = parseInt(m[1]) || 0
    let m_count = parseInt(m[3]) || 0
    let s_count = parseInt(m[5]) || 0

    const extraMinutes = Math.floor(s_count / 60)
    m_count += extraMinutes
    s_count -= extraMinutes * 60
    const extraHours = Math.floor(m_count / 60)
    h_count += extraHours
    m_count -= extraHours * 60

    let totalSeconds = h_count * 3600 + m_count * 60 + s_count

    return {
        valid: true,
        hours: h_count,
        minutes: m_count,
        seconds: s_count,
        timeString: `${h_count}:${m_count}:${s_count}`,
        totalSeconds: totalSeconds,
    }
}

function spawnTimer() {
    const time = formatTime()
    if (!time.valid) return
    const addTime = 500 // Add half a second for nicer looking starting value
    newTimerString.value = ''
    activeTimers.value.unshift({
        key: Math.random().toString(36).substring(7),
        untilTimestamp: Date.now() + time.totalSeconds * 1000 + addTime,
        isDone: false,
        isPaused: false,
    })
}

function timeLeft(key: string, _forceRefreshKey: any) {
    const timer = activeTimers.value.find(t => t.key == key)
    if (!timer) return 'missing timer'
    const timeLeft = timer.untilTimestamp - Date.now()
    if (timeLeft < 0) {
        timer.isDone = true
        return '00:00:00'
    }
    const hours = Math.floor(timeLeft / 3600000).toString().padStart(2, "0")
    const minutes = Math.floor((timeLeft % 3600000) / 60000).toString().padStart(2, "0")
    const seconds = Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
}

function removeTimer(key: string) {
    activeTimers.value = activeTimers.value.filter(t => t.key != key)
}

let timeRenderInterval: NodeJS.Timeout
const forceRefreshKey = ref<number>(0)
onMounted(()=>{
    timeRenderInterval = setInterval(()=>{
        forceRefreshKey.value++
    }, 1000)

    setTimeout(()=>{
        activeTimers.value.unshift({
            key: Math.random().toString(36).substring(7),
            untilTimestamp: Date.now() + 30 * 1000,
            isDone: false,
            isPaused: false,
        })
    }, 3000)
    setTimeout(()=>{
        activeTimers.value.unshift({
            key: Math.random().toString(36).substring(7),
            untilTimestamp: Date.now() + 0.5 * 1000,
            isDone: false,
            isPaused: false,
        })
    }, 1300)
})
onUnmounted(()=>{
    clearInterval(timeRenderInterval)
})
// Vue Transition
function beforeLeave(el: any) {
    const {marginLeft, marginTop, width, height} = window.getComputedStyle(el)

    el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`
    el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`
    el.style.width = width
    el.style.height = height
}
</script>

<style scoped>
.toolInstances {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
}
.instance {
    border: 1px solid rgba(var(--accent-light), 35%);
    /* background: linear-gradient(90deg, rgb(var(--accent-dark)) 10%, rgba(var(--accent-light), 30%) 80%, rgba(var(--accent-light), 40%), rgb(var(--danger-dark))); */
    background: linear-gradient(35deg,
        rgba(var(--accent-dark), 66%) 4%,
        rgba(var(--accent-light), 20%) 30%,
        rgba(var(--accent-dark), 66%) 70%,
        rgba(var(--danger-dark), 20%) 100%
    );
    background-size: 400%;
    background-position: 0%;
    transition: background-position 800ms;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.instance>* {
    margin: 0;
}
.instanceActions {
    display: flex;
    justify-content: space-around;
}
.instanceActions button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background: rgba(var(--accent-light), 50%);
    color: white;
    cursor: pointer;
}
.text-gradient {
    background-image: var(--accent-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 400%;
    background-position: 0%;
}
.inputGroup {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 20ch;
    padding: 0.5rem;
}
.inputGroup input {
    transition: background-color 200ms;
}
.inputGroup:focus-within {
    outline: auto;
}
.inputGroup>* {
    width: 100%;
}
.inputGroup input:disabled {
    border: 2px solid red;
    background-color: rgba(#fff, 50%);
}
.inputPair {
    display: grid;
    grid-template-columns: 1fr auto;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(var(--accent-light), 35%);
}
.inputPair>* {
    width: 100%;
    border: none;
    outline: none;
    background-color: rgba(var(--accent-dark), 20%);
    color: white;
    padding: 6px;
}
.inputGroup input[type="submit"]:hover {
    background-color: rgba(var(--accent-light), 50%);
}
.inputGroup input[type="submit"]:focus {
    background-color: rgba(var(--accent-light), 50%);
} 
.toolName {
    grid-column: span 2;
    font-size: medium;
    text-align: center;
}
.invalid {
    border-color: red;
}
.invalid .toolName {
    color: orangered;
}
.timerText {
    text-align: center;
    transition: background-position 2000ms;
    background: linear-gradient(35deg, orangered 0%, orange 30%, #aa0 60%, #f3f 80%, #fef 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 400%;
    background-position: 100%;
}
.timerIsDone .timerText {
    background-position: 0%;
}
.instance.timerIsDone {
    background-position: 100%;
}
/* Vue Transition */
.spawn-move,
.spawn-enter-active,
.spawn-leave-active {
    transition: transform 600ms, translate 600ms, opacity 600ms;
    pointer-events: none;
}
.spawn-enter-from {
    opacity: 0;
    translate: -50% 0;
}
.spawn-leave-to {
    opacity: 0;
    translate: 0 25%;
}
.spawn-leave-active {
    position: absolute;
    border-color: #f00;
    z-index: 100;
}
</style>
