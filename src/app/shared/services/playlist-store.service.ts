import { Injectable } from '@angular/core';

@Injectable()
export class PlaylistStoreService {
  private ngxYTPlayer = 'ngx_yt_player';
  private playlistTemplate: Object = {
    playlists: []
  };

  constructor() { }

  private init(): void {
    localStorage.setItem(this.ngxYTPlayer, JSON.stringify(this.playlistTemplate));
  }

  public retrieveStorage() {
    let storedPlaylist = this.parse();

    if (!storedPlaylist) {
      this.init();
      storedPlaylist = this.parse();
    }

    return storedPlaylist;
  }

  public addToPlaylist(video: Object): void {
    const store = this.parse();
    store.playlists.push(video);
    localStorage.setItem(this.ngxYTPlayer, JSON.stringify(store));
  }

  public removeFromPlaylist(video: any): void {
    const store = this.parse();
    store.playlists = store.playlists.filter(item => item.id !== video.id);
    localStorage.setItem(this.ngxYTPlayer, JSON.stringify(store));
  }

  private parse() {
    return JSON.parse(localStorage.getItem(this.ngxYTPlayer));
  }

  public clearPlaylist() {
    this.init();
  }

  public importPlaylist(videos: any): void {
    const store = this.parse();
    store.playlists = videos;
    localStorage.setItem(this.ngxYTPlayer, JSON.stringify(store));
  }
}
