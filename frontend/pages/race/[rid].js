import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { existingDummy } from '../existing';
import { useRouter } from 'next/router';
import Image from 'next/image';

export const candidates = [
  {
    cid: 1,
    name: 'Player 1',
    image: '/candidate.png',
    description: 'about me',
  },
  {
    cid: 2,
    name: 'Player 2',
    image: '/candidate.png',
    description: 'about me',
  },
  {
    cid: 2,
    name: 'Player 3',
    image: '/candidate.png',
    description: 'about me',
  },
];
const Race = (props) => {
  const [raceData, setRaceData] = useState(undefined);
  const router = useRouter();
  const thisRace = router.query.rid;

  useEffect(() => {
    if (!!thisRace) {
      setRaceData(existingDummy[router.query.rid - 1]);
    }
  }, [router]);

  console.log(thisRace);

  console.log(raceData);

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
      {raceData ? (
        <>
          <h1>{raceData.race}</h1>
          <h2>{raceData.description}</h2>

          <ul>
            {candidates.map((candidate) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <form>
                    <table>
                      <tr>
                        <th></th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                      </tr>
                      <tr>
                        <td style={{ display: 'flex', alignItems: 'center' }}>
                          <Image
                            src={candidate.image}
                            height={100}
                            width={100}
                          />
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <h3>{candidate.name}</h3>
                            <p>{candidate.description}</p>
                          </div>
                        </td>
                        <td>
                          <input type='radio' name='row1' value='option1' />
                        </td>
                        <td>
                          <input type='radio' name='row1' value='option2' />
                        </td>
                        <td>
                          <input type='radio' name='row1' value='option3' />
                        </td>
                      </tr>
                    </table>
                  </form>
                </div>
              );
            })}
          </ul>
        </>
      ) : (
        'LOADING...'
      )}
    </div>
  );
};

Race.propTypes = {};

export default Race;
