/*console.log('hello'); document.body.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);*/

// Your CSS as text
var styles = `
   /* The Modal (background) */
   .sms-modal {
     display: none; /* Hidden by default */
     position: fixed; /* Stay in place */
     z-index: 1; /* Sit on top */
     padding-top: 100px; /* Location of the box */
     left: 0;
     top: 0;
     width: 100%; /* Full width */
     height: 100%; /* Full height */
     overflow: auto; /* Enable scroll if needed */
     background-color: rgb(0,0,0); /* Fallback color */
     background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
   }
   
   /* Modal Content */
   .sms-modal-content {
     background-color: #fefefe;
     margin: auto;
     padding: 20px;
     border: 1px solid #888;
     width: 80%;
   }
   
   /* The Close Button */
   .sms-close {
     color: #aaaaaa;
     float: right;
     font-size: 28px;
     font-weight: bold;
   }
   
   .sms-close:hover,
   .sms-close:focus {
     color: #000;
     text-decoration: none;
     cursor: pointer;
   }
`

function open_agenda()
{
    var agenda_button = document.querySelector("div[ng-click*=\"dmmrCtrl.goTo('agenda')\"]");

    if (agenda_button)
    {
        if (!document.location.href.contains('#/agenda'))
        {
            agenda_button.click();
        }
    }
    else
    {
        setTimeout(open_agenda, 1000);
    }
}

function choose_message() {
    var modal = document.getElementById("sms-modal-box")
    modal.style.display = "block";
}

function write_sms(type_id) {
    var name_tokens = $("div.bloc-client-2").text().split(" ")
    name = ""
    firstname = ""
    for (let i = 0; i < name_tokens.length; i++) {
        if (name_tokens[i].toUpperCase() == name_tokens[i]) {
            name = name + name_tokens[i] + " ";
        } else {
            firstname = firstname + name_tokens[i] + " ";
        }
    }
    name = name.trim()
    firstname = firstname.trim()

    phone = ""
    mobile_label = $("div.bloc-title:contains('Mobile')")
    if (mobile_label.length) {
        phone = mobile_label.parent().find("a").attr("href").substring(4)
    }

    rdv_label = $("div.showDate-label:contains('Commence')")
    if (rdv_label.length) {
        rdv_value = rdv_label.parent().parent().find("div.showDate-value").text()
        console.log(rdv_value)
        weekday = rdv_value.substring(0, 4)
        switch (weekday) {
            case 'Lun.':
                weekday = "lundi"
                break
            case 'Mar.':
                weekday = "mardi"
                break
            case 'Mer.':
                weekday = "mercredi"
                break
            case 'Jeu.':
                weekday = "jeudi"
                break
            case 'Ven.':
                weekday = "vendredi"
                break
            case 'Sam.':
                weekday = "samedi"
                break
            case 'Dim.':
                weekday = "dimanche"
                break
            default:
                break
        }
        date = rdv_value.substring(4, 15)
        hour = rdv_value.substring(18, 20)
        minutes = rdv_value.substring(21,23)

        console.log(name)
        console.log(firstname)
        console.log(date)
        console.log(hour)
        console.log(minutes)
        console.log(type_id)
        
        //android.setBookingData(name, firstname, phone, date, hour, minutes, weekday);
        message = { "phone": phone,
            "name": name,
            "firstname": firstname,
            "date": date.trim(),
            "hour": hour,
            "minutes": minutes,
            "type_id": type_id }
        
        var modal = document.getElementById("sms-modal-box")
        modal.style.display = "none"
        window.webkit.messageHandlers.write_sms.postMessage(message)
        

    }
}

function add_sms_button() {
    if (typeof interval_sms_button === 'undefined') {
        interval_sms_button = setInterval(add_sms_button, 500);
    }
    
    change_button = jQuery("div[ng-click=\"tucCtrl.razClient()\"]")
    button_row = change_button.parent()
    if (change_button.length) {
        sms_button = jQuery("div.sms-button")
        if (sms_button.length == 0) {
            console.log("insert sms button");
            button_row.css("flex-wrap","wrap");
            button_row.append("<div kalendes-button=\"\" color=\"transparent-bg\" flat=\"true\" class=\"sms-button ng-scope ng-isolate-scope\" role=\"button\" tabindex=\"0\" onclick=\"javascript:choose_message();\"><div class=\"kalendes-button transparent-bg small-radius flat\" layout=\"row\" md-ink-ripple=\"\"><div layout=\"row\" layout-align=\"center center\" class=\"kalendes-button-content ng-scope layout-align-center-center layout-row flex\"><div class=\"kalendes-button-icon ng-scope\"><md-icon md-font-set=\"material-icons\" class=\"ng-binding md-boutique_theme-theme material-icons\" role=\"img\">textsms<\/md-icon><\/div><div class=\"kalendes-button-text ng-scope\"><span class=\"ng-scope\">SMS<\/span><\/div><\/div><!-- empty --><div class=\"md-ripple-container\" style=\"\"><\/div><\/div><\/div>")
        }
        sms_modal_box = jQuery("div#sms-modal-box")
        if (sms_modal_box.length == 0) {
            console.log("add modal box")
            
            var styleSheet = document.createElement("style")
            styleSheet.innerText = styles
            document.head.appendChild(styleSheet)
            
            jQuery("body" ).append( `

            <!-- The Modal -->
            <div id="sms-modal-box" class="sms-modal">

              <!-- Modal content -->
              <div class="sms-modal-content">
                <span class="sms-close">&times;</span>
                <div class="sms-modal-list" style="width: 90%">
                    <div kalendes-button=\"\" color=\"transparent-bg\" flat=\"true\" class=\"sms-choose-button ng-scope ng-isolate-scope\" role=\"button\" tabindex=\"0\" onclick=\"javascript:write_sms(0);\"><div class=\"kalendes-button transparent-bg small-radius flat\" layout=\"row\" md-ink-ripple=\"\"><div layout=\"row\" layout-align=\"center center\" class=\"kalendes-button-content ng-scope layout-align-center-center layout-row flex\"><div class=\"kalendes-button-icon ng-scope\"><md-icon md-font-set=\"material-icons\" class=\"ng-binding md-boutique_theme-theme material-icons\" role=\"img\">textsms<\/md-icon><\/div><div class=\"kalendes-button-text ng-scope\"><span class=\"ng-scope\">Vide<\/span><\/div><\/div><!-- empty --><div class=\"md-ripple-container\" style=\"\"><\/div><\/div><\/div>
                    <div kalendes-button=\"\" color=\"transparent-bg\" flat=\"true\" class=\"sms-choose-button ng-scope ng-isolate-scope\" role=\"button\" tabindex=\"0\" onclick=\"javascript:write_sms(1);\"><div class=\"kalendes-button transparent-bg small-radius flat\" layout=\"row\" md-ink-ripple=\"\"><div layout=\"row\" layout-align=\"center center\" class=\"kalendes-button-content ng-scope layout-align-center-center layout-row flex\"><div class=\"kalendes-button-icon ng-scope\"><md-icon md-font-set=\"material-icons\" class=\"ng-binding md-boutique_theme-theme material-icons\" role=\"img\">textsms<\/md-icon><\/div><div class=\"kalendes-button-text ng-scope\"><span class=\"ng-scope\">Rappel+Note<\/span><\/div><\/div><!-- empty --><div class=\"md-ripple-container\" style=\"\"><\/div><\/div><\/div>
                    <div kalendes-button=\"\" color=\"transparent-bg\" flat=\"true\" class=\"sms-choose-button ng-scope ng-isolate-scope\" role=\"button\" tabindex=\"0\" onclick=\"javascript:write_sms(2);\"><div class=\"kalendes-button transparent-bg small-radius flat\" layout=\"row\" md-ink-ripple=\"\"><div layout=\"row\" layout-align=\"center center\" class=\"kalendes-button-content ng-scope layout-align-center-center layout-row flex\"><div class=\"kalendes-button-icon ng-scope\"><md-icon md-font-set=\"material-icons\" class=\"ng-binding md-boutique_theme-theme material-icons\" role=\"img\">textsms<\/md-icon><\/div><div class=\"kalendes-button-text ng-scope\"><span class=\"ng-scope\">Rappel<\/span><\/div><\/div><!-- empty --><div class=\"md-ripple-container\" style=\"\"><\/div><\/div><\/div>
                </div>
              </div>

            </div>

            ` );
            
            // Get the modal
            var modal = document.getElementById("sms-modal-box");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("sms-close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
              modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = "none";
              }
            }
        }
    }
}

window.onload = add_sms_button
