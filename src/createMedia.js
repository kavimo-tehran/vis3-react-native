const createMedia = (webviewRef, eventHandlers, pendingRequests) => {
  const inject = (code) => {
    webviewRef.current?.injectJavaScript(`${code}; true;`);
  };

  const get = (method, id) =>
    new Promise((resolve) => {
      pendingRequests.current[id] = resolve;
      inject(
        `window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'get', id: '${id}', value: window.__vis3api?.get.${method}() }))`
      );
    });

  return {
    api: {
      get: {
        ID: () => get("ID", Math.random().toString(36).substring(2)),
        CurrentTime: () => get("CurrentTime", Math.random().toString(36).substring(2)),
        Duration: () => get("Duration", Math.random().toString(36).substring(2)),
        Title: () => get("Title", Math.random().toString(36).substring(2)),
      },
      actions: {
        Play: () => inject("window.__vis3api?.actions.Play()"),
        Pause: () => inject("window.__vis3api?.actions.Pause()"),
        Seek: (time) => inject(`window.__vis3api?.actions.Seek(${Number(time)})`),
        Rewind: () => inject("window.__vis3api?.actions.Rewind()"),
        Forward: (sec) => inject(`window.__vis3api?.actions.Forward(${Number(sec)})`),
      },
      events: {
        OnPlay: (cb) => { eventHandlers.current.play = cb; },
        OnPause: (cb) => { eventHandlers.current.pause = cb; },
        OnEnded: (cb) => { eventHandlers.current.ended = cb; },
        OnTimeupdate: (cb) => { eventHandlers.current.timeupdate = cb; },
      },
      DRMText: (options) =>
        inject(`window.__vis3api?.DRMText(${JSON.stringify(options)})`),
    },
  };
};

export default createMedia;
