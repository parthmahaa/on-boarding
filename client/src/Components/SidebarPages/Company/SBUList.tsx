import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Avatar,
  Typography,
  Chip,
  Box
} from '@mui/material';
import {
  DocumentTextIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface SBU {
  id: number;
  logo: string;
  companyName: string;
  location: string;
  type: string;
  identificationNumber: string;
  createdBy: string;
  status: boolean;
}

interface SBUListProps {
  sbuData: SBU[];
  onEdit: (sbu: SBU) => void;
}

const SBUList: React.FC<SBUListProps> = ({ sbuData, onEdit }) => {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>Logo</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Company Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Identification Number</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sbuData.map((sbu) => (
            <TableRow key={sbu.id} hover>
              <TableCell>
                <Avatar
                  src="/placeholder.svg"
                  alt="SBU Logo"
                  sx={{ width: 40, height: 40, bgcolor: 'blue.50' }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {sbu.companyName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{sbu.location}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={sbu.type}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {sbu.identificationNumber}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{sbu.createdBy}</Typography>
              </TableCell>
              <TableCell>
                <Switch checked={sbu.status} color="primary" />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" color="primary">
                    <DocumentTextIcon style={{ width: 18, height: 18 }} />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <EyeIcon style={{ width: 18, height: 18 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(sbu)}
                  >
                    <PencilIcon style={{ width: 18, height: 18 }} />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SBUList;
