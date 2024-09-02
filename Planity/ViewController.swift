//
//  ViewController.swift
//  Kalendes
//
//  Created by Alex on 05/06/2022.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler  {

    var webView: WKWebView!
    var injectCode: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        let filepath = Bundle.main.path(forResource: "injectCode", ofType: "js")
        do {
            let contents = try String(contentsOfFile: filepath!)
            injectCode = contents
        } catch {
            return
        }
        
        let webView = WKWebView(frame: view.bounds)
        webView.isInspectable = true
        
        view.addSubview(webView)
       
        webView.translatesAutoresizingMaskIntoConstraints = false
        
        let safeArea = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: safeArea.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: safeArea.trailingAnchor),
            webView.topAnchor.constraint(equalTo: safeArea.topAnchor),
            webView.bottomAnchor.constraint(equalTo: safeArea.bottomAnchor)
        ])
        webView.pageZoom = 0.8
        webView.scrollView.isScrollEnabled = true
        
        webView.navigationDelegate = self
        webView.configuration.userContentController.add(self, name: "write_sms")
        webView.configuration.allowsInlineMediaPlayback = true
        webView.customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
        guard let url = URL(string: "https://pro.planity.com") else {
            return
        }

        webView.load(URLRequest(url: url))
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {

        if let urlStr = navigationAction.request.url?.absoluteString {
            //urlStr is what you want
            Swift.print(urlStr)
            //let scriptSource = "console.log('hello'); document.body.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);"
            webView.evaluateJavaScript(injectCode)
            
            //webView.evaluateJavaScript("add_sms_button()");
        }

        decisionHandler(.allow)
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "write_sms" {
            
            print(message.body)
            if let messageBody = message.body as? [String: Any],
               let phone = messageBody["phone"] as? String,
               let firstname = messageBody["firstname"] as? String,
               let hour = messageBody["hour"] as? String,
               let date = messageBody["date"] as? String,
               let minutes = messageBody["minutes"] as? String,
               let type_id = messageBody["type_id"] as? Int
            {
                var text = [String]()
                text.append("")
                text.append("Bonjour <FIRSTNAME>, nous avons rdv le <DATE> à <TIME>. Au plaisir de vous revoir. ⭐⭐⭐⭐⭐ Vous aimez venir chez nous ? Faites le savoir en apportant une note à votre institut préféré. Institut Calysta à Blotzheim\nwww.institutcalysta.com/avis")
                text.append("Bonjour <FIRSTNAME>, nous avons rdv le <DATE> à <TIME>. Au plaisir de vous revoir. Institut Calysta à Blotzheim\nwww.institutcalysta.com/boutique")

                let text_to_send = text[type_id].replacingOccurrences(of: "<FIRSTNAME>", with: firstname)
                    .replacingOccurrences(of: "<DATE>", with: date)
                    .replacingOccurrences(of: "<TIME>", with: hour + "h" + minutes)
                    .addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
                
                print(text_to_send)
                
                if phone.starts(with: "+33") {
                    // french number: send an SMS
                    var url_str: String
                    if text_to_send.isEmpty {
                        url_str = "sms://\(phone)"
                    } else {
                        url_str = "sms://\(phone);?&body=\(text_to_send)"
                    }
                    print(url_str)
                    UIApplication.shared.open(URL(string: url_str)!, options: [:], completionHandler: nil)
                } else {
                    var phone_whatsapp: String = phone
                    phone_whatsapp.remove(at: phone_whatsapp.startIndex)
                    let appURL = URL(string: "https://wa.me/\(phone_whatsapp)?text=\(text_to_send)")!
                    print(appURL)
                    if UIApplication.shared.canOpenURL(appURL) {
                        if #available(iOS 10.0, *) {
                            UIApplication.shared.open(appURL, options: [:], completionHandler: nil)
                        }
                        else {
                            UIApplication.shared.openURL(appURL)
                        }
                    }
                }
            }
        }
    }

}

