import React, { useState, useEffect } from 'react';
import Photo from '../componentes/Photo';
import { store } from '../security/TokenStore';
import PubSub from 'pubsub-js';
import { CSSTransition } from 'react-transition-group'

export default ({ user }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchMyTimeline = () => {
      const authParam = `X-AUTH-TOKEN=${store.getValue()}`;
      let timelineUrl = 'http://localhost:8080/api/fotos';

      if (user !== undefined) {
        timelineUrl = `http://localhost:8080/api/public/fotos/${user}`;
      }

      fetch(`${timelineUrl}?${authParam}`)
        .then(resp => resp.json())
        .then(setPhotos);
    };

    fetchMyTimeline();

    const subs = [
      PubSub.subscribe('timeline.search.found', (_, foundPhotos) => setPhotos(foundPhotos)),
      PubSub.subscribe('timeline.search.not-found', fetchMyTimeline),
    ];

    return () => subs.forEach(PubSub.unsubscribe);
  }, [user, photos]);

  return (
    <div className="fotos container">
      <CSSTransition in={true} timeout={200} classNames="timeline">
        <div>
          {
            photos.map(p => (<Photo key={p.id} data={p} />))
          }
        </div>
      </CSSTransition>
    </div>
  );
}
