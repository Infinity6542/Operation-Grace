//TODO: Make the notification system
class notif {
    title: string;
    msg: string;
    icn: string | undefined;
    constructor(title:string, msg:string, icn?:string){
        this.title = title;
        this.msg = msg;
        this.icn = icn;
    }
}

class clock {
    type: string;
    constructor(type:string) {
        if (type == "digital") {
            //TODO: Implement solaris digital clock
            // Will probably use this:
            // https://github.com/conartist6/splitflap
        } else if (type == "analog") {
            //TODO: Implement analog clock.
            // Will probably use this:
            // https://codepen.io/imvpn22/pen/RwPvOgQ
            // but animated.
        }
    }
}