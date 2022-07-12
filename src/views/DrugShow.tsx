import React from 'react';
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { Card, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';

import { Header } from '../components';
import { getDrugs, getNDCs } from '../utils';

import type { Drug } from '../types';

function DrugShow() {
  const [ndcs, setNdcs] = React.useState<string[]>([]);
  const [drug, setDrug] = React.useState<Drug | null>();
  const [searchParams] = useSearchParams();
  const rxcui = searchParams.get('rxcui');
  const searchText = searchParams.get('searchText');
  const { drugName } = useParams();

  React.useEffect(() => {
    if (!rxcui || !searchText) { return; }

    const getEm = async (): Promise<void> => {
      const [drugs, newNdcs] = await Promise.all([
        await getDrugs(searchText),
        await getNDCs(rxcui)
      ])
      setNdcs(newNdcs);
      const drug = drugs.find(d => d.name === drugName);
      setDrug(drug);
    };
    getEm();
  }, [rxcui, searchText, drugName]);

  if (!rxcui || !searchText) {
    return <Navigate to="/drugs/search" replace />;
  }

  return (
    <div>
      <Header />
      <Card variant="outlined" sx={{ margin: '30px auto', padding: '30px', width: '70%' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="h5">Full name:</Typography>
              </TableCell>
              <TableCell>
                <Typography>{drug?.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h5">Synonym:</Typography>
              </TableCell>
              <TableCell>
                <Typography>{drug?.synonym}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h5">RXCUI:</Typography>
              </TableCell>
              <TableCell>
                <Typography>{rxcui}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h5">NDCs:</Typography>
              </TableCell>
              <TableCell>
                <Typography>{ndcs.join(', ')}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default DrugShow;
