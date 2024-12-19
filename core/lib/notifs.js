//TODO: Make the notification system
class notif {
    constructor(title, msg, icn) {
        this.title = title;
        this.msg = msg;
        this.icn = icn;
    }
}
class clock {
    constructor(type) {
        if (type == "digital") {
            //TODO: Implement solaris digital clock
            // Will probably use this:
            // https://github.com/conartist6/splitflap
        }
        else if (type == "analog") {
            //TODO: Implement analog clock.
            // Will probably use this:
            // https://codepen.io/imvpn22/pen/RwPvOgQ
            // but animated.
        }
    }
}
//# sourceMappingURL=notifs.js.map