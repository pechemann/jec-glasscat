//  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
//
//   Copyright 2016-2018 Pascal ECHEMANN.
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import {Component, OnInit, OnDestroy} from '@angular/core';
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {Router} from '@angular/router';
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {ContextService} from "../../services/ContextService";
import {MessagingService} from "../../services/messaging/MessagingService";
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";
import {Subscription} from "rxjs/Rx";
import {HttpListenerConfig, BootstrapConfig} from "jec-glasscat-config";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';

@Component({
  selector: 'app-httptasks',
  templateUrl: "./templates/configuration/httptasks.html",
})
export class HttpTasksComponent implements OnInit, OnDestroy {

  constructor(private _breadcrumbService:BreadcrumbService,
              private _contextService:ContextService,
              private _messagingService:MessagingService,
              private _dialogMessageService:DialogMessageService,
              private _router:Router){}

  public httpTaskListModel:HttpListenerConfig[] = null;

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.getContext();
  }

  public ngOnDestroy():void {
    this._contextSubscriber.unsubscribe();
  }

  public openCreateView():void {
    this._router.navigate(['/configuration/httptasks/create']);
  }

  public itemSelect(item:any):void {
    this._router.navigate(['/configuration/httptasks/edit', item.id]);
  }
  
  private _contextSubscriber:Subscription = null;
  private _context:BootstrapConfig = null;

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Configuration"),
      ConsoleMenuItem.buildItem("HTTP Tasks", ['/configuration/httptasks'])
    ]);
  }
  
  private getContext():void {
    this._contextSubscriber = this._contextService.getContext().subscribe(
      data => {
        this._context = data;
        this.httpTaskListModel = data.config.http.listeners;
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Context initialization error",
          "An error occured while loading configuration files.<br/>You must restart the application."
        ));
        console.error(err);
      }
    );
  }
}