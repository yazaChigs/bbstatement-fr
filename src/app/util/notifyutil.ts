import { SnotifyToastConfig, SnotifyPosition, SnotifyService } from 'ng-snotify';

export class NotifyUtil {

 constructor(private snotifyService: SnotifyService) {}

  getNotifyConfig(): SnotifyToastConfig {
  this.snotifyService.setDefaults({
    global: {
      newOnTop: true,
      maxAtPosition: 6,
      maxOnScreen: 8
    }
  });
    return {
    bodyMaxLength: 80,
    titleMaxLength: 30,
    backdrop: -1,
    position: SnotifyPosition.centerTop,
    timeout: 3000,
    showProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true
  };
  }
  getNotifyConfigPrompt(): SnotifyToastConfig {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: true,
        maxAtPosition: 6,
        maxOnScreen: 8
      }
    });
    return {
      bodyMaxLength: 80,
      titleMaxLength: 30,
      backdrop: -1,
      position: SnotifyPosition.centerCenter,
      timeout: 8000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true
    };
  }

}
