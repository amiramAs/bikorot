new Vue({
    data() {
        return {
            pass: null,
            passAgain: null,
            queryString: null,
            urlParams: null, resetLink: null
        }
    },
    mounted() {
        this.queryString = window.location.search;
        this.urlParams = new URLSearchParams(this.queryString);
        this.resetLink = this.urlParams.get("resetLink");
    },
    methods: {
        send(pass, passAgain, resetLink) {
            if (pass === passAgain && pass != null) {
                fetch("/reset-password", {
                    body: JSON.stringify({ pass, resetLink }), method: "PUT",
                    headers: { "Content-Type": "application/json", },
                }).then((response) => response.json())
                    .then((data) => {
                        if (data.message === "ok") window.alert("הסיסמה שוחזרה בהצלחה");
                        else if (data.error === "jwt expired") window.alert("תוקף הקישור נגמר");
                        else if (data.error === "invalid signature") window.alert("הקישור אינו תקין");
                        else window.alert("לא הצלחנו לשחזר את הסיסמה, נסה שוב בהמשך/n" + data.error);
                    });
            }
                 else window.alert("הסיסמאות אינם תואמות")
        },
    },
}).$mount("#app")