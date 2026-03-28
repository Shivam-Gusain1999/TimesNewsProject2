import "dotenv/config";
import mongoose from "mongoose";
import { Category } from "./src/models/category.model.js";
import { Article } from "./src/models/article.model.js";
import { Video } from "./src/models/video.model.js";
import { User } from "./src/models/user.model.js";
import { WebStory } from "./src/models/webstory.model.js";

const MONGODB_URI = process.env.MONGODB_URI;

const categories = [
  { name: "देश", description: "राष्ट्रीय समाचार" },
  { name: "विदेश", description: "अंतर्राष्ट्रीय समाचार" },
  { name: "राजनीति", description: "राजनीतिक समाचार" },
  { name: "खेल", description: "खेल जगत की खबरें" },
  { name: "क्रिकेट", description: "क्रिकेट समाचार" },
  { name: "टेक्नोलॉजी", description: "तकनीक एवं गैजेट्स" },
  { name: "मनोरंजन", description: "बॉलीवुड और मनोरंजन" },
  { name: "बिजनेस", description: "व्यापार एवं अर्थव्यवस्था" },
  { name: "शिक्षा", description: "शिक्षा एवं करियर" },
  { name: "लाइफस्टाइल", description: "जीवनशैली एवं स्वास्थ्य" },
];

const articlesData = {
  "देश": [
    {
      title: "राजस्थान में भीषण गर्मी का अलर्ट, तापमान 45 डिग्री के पार",
      content: "<p>राजस्थान के कई जिलों में भीषण गर्मी का दौर जारी है। मौसम विभाग ने बीकानेर, जोधपुर, जैसलमेर और बाड़मेर समेत 12 जिलों में रेड अलर्ट जारी किया है। तापमान 45 डिग्री सेल्सियस के पार पहुंच गया है। अधिकारियों ने लोगों से दोपहर में बाहर न निकलने की अपील की है।</p><p>मुख्यमंत्री ने अस्पतालों में हीट स्ट्रोक वार्ड खोलने के निर्देश दिए हैं। सभी सरकारी कार्यालयों में पीने के पानी की व्यवस्था सुनिश्चित की जा रही है।</p>",
      slug: "rajasthan-heat-wave-alert-march-2026",
      thumbnail: "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800&q=80",
    },
    {
      title: "दिल्ली-मुंबई एक्सप्रेसवे पर बड़ा हादसा, 5 गाड़ियां आपस में टकराईं",
      content: "<p>दिल्ली-मुंबई एक्सप्रेसवे पर आज सुबह कोहरे के कारण 5 गाड़ियां आपस में टकरा गईं। इस हादसे में 3 लोगों की मौत हो गई जबकि 12 लोग घायल हो गए हैं। घायलों को नजदीकी अस्पताल में भर्ती कराया गया है।</p><p>पुलिस ने एक्सप्रेसवे के एक हिस्से को बंद कर दिया है और ट्रैफिक को वैकल्पिक रास्ते से भेजा जा रहा है।</p>",
      slug: "delhi-mumbai-expressway-accident-march-2026",
      thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80",
    },
    {
      title: "प्रधानमंत्री ने 'मेक इन इंडिया 3.0' का शुभारंभ किया, 50 लाख नौकरियों का लक्ष्य",
      content: "<p>प्रधानमंत्री ने आज नई दिल्ली में 'मेक इन इंडिया 3.0' कार्यक्रम का शुभारंभ किया। इस कार्यक्रम के तहत अगले 5 साल में 50 लाख नई नौकरियां पैदा करने का लक्ष्य रखा गया है। सेमीकंडक्टर, इलेक्ट्रिक वाहन और ग्रीन एनर्जी सेक्टर पर विशेष फोकस होगा।</p>",
      slug: "make-in-india-3-launch-march-2026",
      thumbnail: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80",
    },
  ],
  "विदेश": [
    {
      title: "अमेरिका-चीन व्यापार युद्ध तेज, नए टैरिफ की घोषणा",
      content: "<p>अमेरिका ने चीन से आयातित इलेक्ट्रॉनिक सामानों पर 35% अतिरिक्त टैरिफ लगाने की घोषणा की है। इसके जवाब में चीन ने भी अमेरिकी कृषि उत्पादों पर 25% शुल्क बढ़ाने का फैसला लिया है। विश्लेषकों का मानना है कि इससे वैश्विक बाजारों में उतार-चढ़ाव बना रहेगा।</p>",
      slug: "us-china-trade-war-tariffs-march-2026",
      thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
    },
    {
      title: "इजराइल-ईरान तनाव बढ़ा, UN ने तत्काल शांति वार्ता की अपील की",
      content: "<p>मध्य पूर्व में तनाव लगातार बढ़ रहा है। इजराइल और ईरान के बीच सैन्य गतिविधियां तेज हो गई हैं। संयुक्त राष्ट्र महासचिव ने दोनों देशों से संयम बरतने और तत्काल शांति वार्ता शुरू करने की अपील की है।</p>",
      slug: "israel-iran-tension-un-peace-march-2026",
      thumbnail: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    },
    {
      title: "NASA के आर्टेमिस-IV मिशन से चांद पर भारतीय अंतरिक्ष यात्री भेजने की तैयारी",
      content: "<p>NASA और ISRO के बीच ऐतिहासिक समझौते के तहत आर्टेमिस-IV मिशन में एक भारतीय अंतरिक्ष यात्री को चंद्रमा पर भेजने की तैयारी चल रही है। यह मिशन 2027 में लॉन्च होने की संभावना है।</p>",
      slug: "nasa-artemis-indian-astronaut-moon-2026",
      thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
    },
  ],
  "राजनीति": [
    {
      title: "5 राज्यों में विधानसभा चुनाव की तारीखों का ऐलान, अप्रैल-मई में होंगे मतदान",
      content: "<p>चुनाव आयोग ने आज 5 राज्यों — बिहार, असम, केरल, तमिलनाडु और पश्चिम बंगाल में विधानसभा चुनाव की तारीखों की घोषणा की। मतदान अप्रैल-मई 2026 में होगा और नतीजे 15 जून को आएंगे। आदर्श आचार संहिता तत्काल प्रभाव से लागू हो गई है।</p>",
      slug: "5-states-assembly-elections-dates-2026",
      thumbnail: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
    },
    {
      title: "राज्यसभा में महिला आरक्षण विधेयक पास, विपक्ष का वॉकआउट",
      content: "<p>राज्यसभा में आज महिला आरक्षण विधेयक ध्वनि मत से पारित हो गया। इस बिल के तहत लोकसभा और विधानसभाओं में महिलाओं के लिए 33% सीटें आरक्षित होंगी। विपक्ष ने बिल में OBC आरक्षण शामिल न होने पर वॉकआउट किया।</p>",
      slug: "womens-reservation-bill-rajya-sabha-2026",
      thumbnail: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    },
    {
      title: "AAP-कांग्रेस गठबंधन टूटा, दोनों पार्टियां अलग-अलग लड़ेंगी चुनाव",
      content: "<p>INDIA गठबंधन में बड़ी दरार आ गई है। AAP और कांग्रेस ने आज औपचारिक रूप से गठबंधन खत्म करने की घोषणा की। दोनों पार्टियां आगामी विधानसभा चुनावों में अलग-अलग लड़ेंगी। इस फैसले से विपक्षी एकता पर सवाल खड़े हो गए हैं।</p>",
      slug: "aap-congress-alliance-breaks-2026",
      thumbnail: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
    },
  ],
  "खेल": [
    {
      title: "भारत ने ऑस्ट्रेलिया को टेस्ट सीरीज में 3-1 से हराया, ऐतिहासिक जीत",
      content: "<p>भारतीय क्रिकेट टीम ने ऑस्ट्रेलिया को उनकी ही धरती पर टेस्ट सीरीज में 3-1 से हराकर इतिहास रच दिया है। यशस्वी जायसवाल ने सीरीज में सबसे ज्यादा रन बनाए और प्लेयर ऑफ द सीरीज चुने गए।</p>",
      slug: "india-beats-australia-test-series-2026",
      thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    },
    {
      title: "IPL 2026 का शेड्यूल जारी, 22 मार्च से शुरू होगा टूर्नामेंट",
      content: "<p>BCCI ने IPL 2026 के पूरे शेड्यूल की घोषणा कर दी है। टूर्नामेंट 22 मार्च से शुरू होगा और फाइनल 25 मई को अहमदाबाद के नरेंद्र मोदी स्टेडियम में खेला जाएगा। पहला मैच चेन्नई सुपर किंग्स और मुंबई इंडियंस के बीच होगा।</p>",
      slug: "ipl-2026-schedule-released",
      thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
    },
    {
      title: "ओलंपिक 2028 के लिए भारतीय दल की तैयारी जोरों पर, 150 खिलाड़ी चुने गए",
      content: "<p>खेल मंत्रालय ने लॉस एंजेल्स ओलंपिक 2028 की तैयारियों के लिए 150 खिलाड़ियों को विशेष प्रशिक्षण कार्यक्रम में शामिल किया है। इस बार भारत का लक्ष्य 15 से ज्यादा पदक जीतना है।</p>",
      slug: "india-olympics-2028-preparation",
      thumbnail: "https://images.unsplash.com/photo-1461896836934-bd45ba8a0acd?w=800&q=80",
    },
  ],
  "क्रिकेट": [
    {
      title: "विराट कोहली ने अंतर्राष्ट्रीय क्रिकेट में पूरे किए 15000 रन",
      content: "<p>भारतीय क्रिकेट के दिग्गज बल्लेबाज विराट कोहली ने अंतर्राष्ट्रीय क्रिकेट में 15,000 रन पूरे कर लिए हैं। वे सचिन तेंदुलकर के बाद यह उपलब्धि हासिल करने वाले दूसरे भारतीय बल्लेबाज बन गए हैं।</p>",
      slug: "virat-kohli-15000-international-runs-2026",
      thumbnail: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80",
    },
    {
      title: "महिला क्रिकेट: भारत ने इंग्लैंड को फाइनल में हराकर T20 विश्व कप जीता",
      content: "<p>भारतीय महिला क्रिकेट टीम ने शानदार प्रदर्शन करते हुए T20 विश्व कप के फाइनल में इंग्लैंड को 7 विकेट से हराकर खिताब अपने नाम किया। कप्तान हरमनप्रीत कौर ने नाबाद 78 रन की शानदार पारी खेली।</p>",
      slug: "india-women-t20-world-cup-win-2026",
      thumbnail: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
    },
    {
      title: "BCCI ने 2027 चैंपियंस ट्रॉफी की मेजबानी का ऐलान किया",
      content: "<p>BCCI ने घोषणा की है कि 2027 ICC चैंपियंस ट्रॉफी का आयोजन भारत में किया जाएगा। टूर्नामेंट के मैच दिल्ली, मुंबई, कोलकाता, चेन्नई और अहमदाबाद में खेले जाएंगे।</p>",
      slug: "bcci-champions-trophy-2027-india",
      thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    },
  ],
  "टेक्नोलॉजी": [
    {
      title: "Apple ने लॉन्च किया iPhone 18 Pro, AI फीचर्स के साथ आया नया कैमरा सिस्टम",
      content: "<p>Apple ने अपना लेटेस्ट फ्लैगशिप स्मार्टफोन iPhone 18 Pro लॉन्च कर दिया है। इसमें A20 Bionic चिप, 108MP ट्रिपल कैमरा सेटअप और on-device AI असिस्टेंट शामिल है। भारत में कीमत ₹1,39,900 से शुरू होगी।</p>",
      slug: "apple-iphone-18-pro-launch-2026",
      thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    },
    {
      title: "Elon Musk की Neuralink ने पहले मरीज का सफल ब्रेन चिप ऑपरेशन किया",
      content: "<p>Elon Musk की कंपनी Neuralink ने अपने पहले मानव मरीज का सफल ब्रेन-कंप्यूटर इंटरफेस ऑपरेशन पूरा किया है। 35 वर्षीय मरीज अब अपने विचारों से कंप्यूटर चला सकता है। यह मेडिकल साइंस में क्रांतिकारी कदम माना जा रहा है।</p>",
      slug: "neuralink-brain-chip-success-2026",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    },
    {
      title: "Jio ने लॉन्च किया ₹999 का 5G स्मार्टफोन, डिजिटल इंडिया को मिलेगी रफ्तार",
      content: "<p>Reliance Jio ने भारत का सबसे सस्ता 5G स्मार्टफोन JioPhone 5G लॉन्च किया है। इसकी कीमत मात्र ₹999 है। इसमें 6.5 इंच डिस्प्ले, 13MP कैमरा और 4000mAh बैटरी दी गई है। कंपनी का लक्ष्य ग्रामीण भारत तक 5G पहुंचाना है।</p>",
      slug: "jio-5g-smartphone-999-launch-2026",
      thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    },
  ],
  "मनोरंजन": [
    {
      title: "शाहरुख खान की नई फिल्म 'King' का ट्रेलर रिलीज, तोड़े सारे रिकॉर्ड",
      content: "<p>बॉलीवुड सुपरस्टार शाहरुख खान की बहुप्रतीक्षित फिल्म 'King' का ट्रेलर आज रिलीज हो गया है। ट्रेलर ने 24 घंटे में YouTube पर 10 करोड़ से ज्यादा व्यूज पार कर लिए, जो भारतीय सिनेमा का नया रिकॉर्ड है।</p>",
      slug: "shahrukh-khan-king-trailer-2026",
      thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    },
    {
      title: "आलिया भट्ट को मिला ऑस्कर नॉमिनेशन, भारत में जश्न का माहौल",
      content: "<p>बॉलीवुड अभिनेत्री आलिया भट्ट ने इतिहास रच दिया है। उनकी हिंदी फिल्म 'जिगरा' को ऑस्कर के लिए 'Best International Feature Film' कैटेगरी में नॉमिनेट किया गया है। वे ऑस्कर नॉमिनेशन पाने वाली पहली हिंदी अभिनेत्री बन गई हैं।</p>",
      slug: "alia-bhatt-oscar-nomination-2026",
      thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    },
    {
      title: "Pushpa 3 की शूटिंग शुरू, अल्लू अर्जुन ने शेयर की पहली झलक",
      content: "<p>तेलुगु सुपरस्टार अल्लू अर्जुन ने सोशल मीडिया पर 'Pushpa 3: The Rampage' की शूटिंग शुरू होने की जानकारी दी। फिल्म 2027 में रिलीज होगी। फिल्म का बजट ₹500 करोड़ से ज्यादा बताया जा रहा है।</p>",
      slug: "pushpa-3-shooting-starts-2026",
      thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    },
  ],
  "बिजनेस": [
    {
      title: "सेंसेक्स ने पहली बार 90,000 का आंकड़ा छुआ, निवेशकों में खुशी की लहर",
      content: "<p>बंबई शेयर बाजार का प्रमुख सूचकांक सेंसेक्स ने आज पहली बार 90,000 का ऐतिहासिक आंकड़ा पार कर लिया। FII की भारी खरीदारी और मजबूत GDP ग्रोथ के आंकड़ों से बाजार में तेजी आई। निफ्टी 50 भी 27,200 के पार बंद हुआ।</p>",
      slug: "sensex-crosses-90000-first-time-2026",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    },
    {
      title: "भारत बना दुनिया की तीसरी सबसे बड़ी अर्थव्यवस्था, जापान को पछाड़ा",
      content: "<p>IMF की ताजा रिपोर्ट के अनुसार भारत ने GDP के मामले में जापान को पीछे छोड़कर दुनिया की तीसरी सबसे बड़ी अर्थव्यवस्था का दर्जा हासिल कर लिया है। भारत की GDP अब 4.5 ट्रिलियन डॉलर से ज्यादा हो गई है।</p>",
      slug: "india-third-largest-economy-2026",
      thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
    },
    {
      title: "पेट्रोल-डीजल के दाम में ₹5 की कटौती, सरकार ने दी राहत",
      content: "<p>केंद्र सरकार ने आज पेट्रोल और डीजल की कीमतों में ₹5 प्रति लीटर की कटौती की घोषणा की। नई कीमतें कल सुबह 6 बजे से लागू होंगी। दिल्ली में पेट्रोल की कीमत अब ₹89.50 प्रति लीटर होगी।</p>",
      slug: "petrol-diesel-price-cut-march-2026",
      thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80",
    },
  ],
  "शिक्षा": [
    {
      title: "CBSE 12वीं के नतीजे घोषित, इस बार 95% रहा पास प्रतिशत",
      content: "<p>CBSE ने कक्षा 12वीं के परिणाम जारी कर दिए हैं। इस बार 95.2% विद्यार्थी उत्तीर्ण हुए हैं, जो पिछले साल से 1.5% ज्यादा है। लड़कियों ने इस बार भी लड़कों से बेहतर प्रदर्शन किया है। टॉपर दिल्ली की अनन्या शर्मा ने 99.6% अंक हासिल किए।</p>",
      slug: "cbse-12th-results-2026",
      thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80",
    },
    {
      title: "JEE Main 2026 के लिए रजिस्ट्रेशन शुरू, जानिए पूरा शेड्यूल",
      content: "<p>NTA ने JEE Main 2026 Session-2 के लिए रजिस्ट्रेशन प्रक्रिया शुरू कर दी है। अंतिम तिथि 15 अप्रैल 2026 है। परीक्षा 1 मई से 15 मई के बीच आयोजित की जाएगी। इस बार परीक्षा पूरी तरह कंप्यूटर बेस्ड होगी।</p>",
      slug: "jee-main-2026-registration-schedule",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    },
    {
      title: "NEP 2025: स्कूलों में कोडिंग और AI अनिवार्य, कक्षा 6 से शुरू होगी पढ़ाई",
      content: "<p>शिक्षा मंत्रालय ने नई शिक्षा नीति के तहत कक्षा 6 से कोडिंग और आर्टिफिशियल इंटेलिजेंस (AI) की पढ़ाई अनिवार्य करने का फैसला लिया है। यह नई अप्रैल 2026 सत्र से लागू होगी।</p>",
      slug: "nep-coding-ai-compulsory-schools-2026",
      thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    },
  ],
  "लाइफस्टाइल": [
    {
      title: "गर्मियों में त्वचा की देखभाल: डर्मेटोलॉजिस्ट की 10 जरूरी टिप्स",
      content: "<p>गर्मियों में बढ़ती धूप और उमस से त्वचा को विशेष देखभाल की जरूरत होती है। डर्मेटोलॉजिस्ट डॉ. प्रिया शर्मा ने गर्मियों में स्किनकेयर के लिए 10 जरूरी सुझाव दिए हैं — SPF 50 सनस्क्रीन का इस्तेमाल, हाइड्रेशन, विटामिन C सीरम और हल्के मॉइस्चराइजर का उपयोग शामिल है।</p>",
      slug: "summer-skincare-tips-dermatologist-2026",
      thumbnail: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80",
    },
    {
      title: "योग दिवस 2026: PM ने बताए 5 आसन जो हर किसी को रोज करने चाहिए",
      content: "<p>अंतर्राष्ट्रीय योग दिवस 2026 की तैयारियों के बीच प्रधानमंत्री ने सोशल मीडिया पर 5 योगासनों की जानकारी शेयर की जो हर उम्र के लोगों के लिए फायदेमंद हैं — सूर्य नमस्कार, प्राणायाम, ताड़ासन, भुजंगासन और शवासन।</p>",
      slug: "yoga-day-2026-5-asanas-pm",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    },
    {
      title: "इंटरमिटेंट फास्टिंग: क्या 16:8 डाइट सच में वजन कम करती है? जानें सच",
      content: "<p>इंटरमिटेंट फास्टिंग (IF) पिछले कुछ सालों में वजन घटाने का सबसे लोकप्रिय तरीका बन गया है। AIIMS दिल्ली के न्यूट्रिशन विभाग ने एक नई स्टडी जारी की है जिसमें बताया गया है कि 16:8 मेथड से औसतन 3 महीने में 4-6 किलो वजन कम हो सकता है।</p>",
      slug: "intermittent-fasting-weight-loss-aiims-study-2026",
      thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    },
  ],
};

const videosData = [
  { title: "IPL 2026: चेन्नई vs मुंबई — पहले मैच की हाइलाइट्स", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "क्रिकेट", description: "IPL 2026 का पहला मैच रोमांचक रहा, चेन्नई ने मुंबई को 6 विकेट से हराया।" },
  { title: "दिल्ली में भीषण गर्मी, सड़कों पर पड़ रही दरारें", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "देश", description: "राजधानी दिल्ली का तापमान 44 डिग्री को पार कर गया, ग्राउंड रिपोर्ट।" },
  { title: "iPhone 18 Pro अनबॉक्सिंग और पहले इम्प्रेशन", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "टेक्नोलॉजी", description: "Apple के लेटेस्ट फ्लैगशिप iPhone 18 Pro का डिटेल्ड रिव्यू।" },
  { title: "'King' ट्रेलर रिएक्शन: शाहरुख खान ने मचाया धमाल", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "मनोरंजन", description: "SRK की फिल्म 'King' का ट्रेलर देखकर फैंस हुए दीवाने।" },
  { title: "सेंसेक्स 90,000 पार: बाजार में निवेशकों ने मनाया जश्न", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "बिजनेस", description: "भारतीय शेयर बाजार ने ऐतिहासिक ऊंचाई हासिल की।" },
  { title: "5 राज्यों में चुनाव: किसकी बनेगी सरकार? विश्लेषण", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "राजनीति", description: "विशेष रिपोर्ट — 5 राज्यों में विधानसभा चुनावों का विस्तृत विश्लेषण।" },
  { title: "भारत बना तीसरी सबसे बड़ी अर्थव्यवस्था, जश्न और चुनौतियां", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "बिजनेस", description: "भारत ने जापान को पछाड़ा, लेकिन आगे की राह आसान नहीं।" },
  { title: "NASA-ISRO: चांद पर भारतीय अंतरिक्ष यात्री — पूरी कहानी", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "विदेश", description: "आर्टेमिस-IV मिशन में भारतीय अंतरिक्ष यात्री कैसे जाएंगे चांद पर।" },
  { title: "CBSE 12वीं रिजल्ट: टॉपर अनन्या शर्मा से खास बातचीत", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "शिक्षा", description: "99.6% अंक लाने वाली अनन्या ने बताया अपनी सफलता का राज।" },
  { title: "गर्मियों में रखें स्वास्थ्य का ख्याल: डॉक्टर की सलाह", videoUrl: "https://www.youtube.com/watch?v=USKD3vPD6ZA", categoryName: "लाइफस्टाइल", description: "गर्मी में डिहाइड्रेशन और हीट स्ट्रोक से बचने के आसान उपाय।" },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find admin user
    let admin = await User.findOne({ role: "ADMIN" });
    if (!admin) {
      admin = await User.findOne({});
    }
    if (!admin) {
      console.error("❌ No user found in database! Create a user first.");
      process.exit(1);
    }
    console.log(`👤 Using author: ${admin.fullName} (${admin.role})`);

    // Clear existing data
    await Category.deleteMany({});
    await Article.deleteMany({});
    await Video.deleteMany({});
    console.log("🗑️  Cleared old categories, articles, videos");

    // Create categories
    const catDocs = {};
    for (const cat of categories) {
      const doc = await Category.create(cat);
      catDocs[cat.name] = doc;
      console.log(`📂 Created category: ${cat.name}`);
    }

    // Create articles
    let articleCount = 0;
    for (const [catName, arts] of Object.entries(articlesData)) {
      const category = catDocs[catName];
      if (!category) continue;

      for (const art of arts) {
        await Article.create({
          title: art.title,
          slug: art.slug,
          content: art.content,
          thumbnail: art.thumbnail,
          category: category._id,
          author: admin._id,
          status: "PUBLISHED",
          views: Math.floor(Math.random() * 5000) + 500,
        });
        articleCount++;
      }
    }
    console.log(`📰 Created ${articleCount} articles`);

    // Create videos
    for (const vid of videosData) {
      const category = catDocs[vid.categoryName];
      if (!category) continue;

      await Video.create({
        title: vid.title,
        videoUrl: vid.videoUrl,
        description: vid.description,
        category: category._id,
        status: "PUBLISHED",
        views: Math.floor(Math.random() * 10000) + 1000,
      });
    }
    console.log(`🎬 Created ${videosData.length} videos`);

    console.log("\n🎉 Seed complete! Your database is now populated with realistic Hindi news.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
