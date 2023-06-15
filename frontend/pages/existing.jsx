import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export const existingDummy = [
  {
    rid: 1,
    race: 'best flower',
    description: 'choose yr flower',
  },
  {
    rid: 2,
    race: 'best pokemon',
    description: 'choose yr fighter',
  },
  {
    rid: 3,
    race: 'best ice cream',
    description: 'choose yr flavor',
  },
];

const existing = (props) => {
  return (
    <div
      style={{
        padding: '2rem 0',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Existing Races</h1>
      <ul>
        {existingDummy.map((race) => {
          return (
            <li key={race.rid}>
              <Link href={`/race/${race.rid}`}>
                {race.race} -- {race.description}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

existing.propTypes = {};

export default existing;
