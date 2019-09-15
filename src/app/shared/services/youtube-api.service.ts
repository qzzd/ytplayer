import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { NotificationService } from './notification.service';
import { YOUTUBE_API_KEY } from '../constants';

@Injectable()
export class YoutubeApiService {
  baseUrl = 'https://www.googleapis.com/youtube/v3/';
  maxResults = 50;

  public nextToken: string;
  public lastQuery: string;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  searchVideos(query: string): Promise<any> {
    const url = `${this.baseUrl}search?q=${query}&maxResults=${this.maxResults}&type=video&part=snippet,id&key=${YOUTUBE_API_KEY}&videoEmbeddable=true`; // tslint:disable-line

    return this.http.get(url)
      .map((response: any) => {
        console.log(response);
        // const jsonRes = response.json();
        const res = response.items;
        this.lastQuery = query;
        this.nextToken = response.nextPageToken ? response.nextPageToken : undefined;

        const ids = [];

        res.forEach((item) => {
          ids.push(item.id.videoId);
        });

        return this.getVideos(ids);
      })
      .toPromise()
      .catch(this.handleError);
  }

  searchNext(): Promise<any> {
    const url = `${this.baseUrl}search?q=${this.lastQuery}&pageToken=${this.nextToken}&maxResults=${this.maxResults}&type=video&part=snippet,id&key=${YOUTUBE_API_KEY}&videoEmbeddable=true`; // tslint:disable-line

    return this.http.get(url)
      .map((response: any) => {
        const res = response.items;
        this.nextToken = response.nextPageToken ? response.nextPageToken : undefined;
        const ids = [];

        res.forEach((item) => {
          ids.push(item.id.videoId);
        });

        return this.getVideos(ids);
      })
      .toPromise()
      .catch(this.handleError);
  }

  getVideos(ids): Promise<any> {
    const url = `${this.baseUrl}videos?id=${ids.join(',')}&maxResults=${this.maxResults}&type=video&part=snippet,contentDetails,statistics&key=${YOUTUBE_API_KEY}`; // tslint:disable-line

    return this.http.get(url)
      .map((response: any) => {
        return response.items;
      })
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse | any): Promise<string> {
    let errMsg: string;
    if (error instanceof HttpErrorResponse ) {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.message || ''}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    this.notificationService.showNotification(errMsg);
    return Promise.reject(errMsg);
  }
}
