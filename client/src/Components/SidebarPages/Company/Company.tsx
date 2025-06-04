import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Drawer,
  Grid as MuiGrid,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import CompanyDetailsForm from './CompanyDetailsForm';
import SBUList from './SBUList';
import SBUForm from './SBUForm';

const Grid = (props: any) => <MuiGrid {...props} item />; 

const CompanyDetail = () => {
  const [isCompanyEditOpen, setIsCompanyEditOpen] = useState(false);
  const [isSBUFormOpen, setIsSBUFormOpen] = useState(false);
  const [selectedSBU, setSelectedSBU] = useState<SBU | null>(null);

  // Mock company data
  const companyData = {
    logo: "/placeholder.svg",
    name: "Ratnaafin Group",
    location: "Ahmedabad",
    email: "abc@gmail.com",
    phone: "9016130464",
    shortName: "Ratnaafin Group",
    type: "Pvt. Ltd",
    pfNumber: "GJAHD2283569000",
    esicNumber: "3700115620000100"
  };

  // Mock SBU data
  const [sbuData, setSbuData] = useState([
    {
      id: 1,
      logo: "/placeholder.svg",
      companyName: "Ratnaafin Group",
      location: "India - 380052",
      type: "Partnership",
      identificationNumber: "U67190TN2014PTC096978",
      createdBy: "Ratnaafin",
      status: true
    }
  ]);

  const handleAddSBU = () => {
    setSelectedSBU(null);
    setIsSBUFormOpen(true);
  };

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

  interface CompanyData {
    logo: string;
    name: string;
    location: string;
    email: string;
    phone: string;
    shortName: string;
    type: string;
    pfNumber: string;
    esicNumber: string;
  }

  const handleEditSBU = (sbu: SBU) => {
    setSelectedSBU(sbu);
    setIsSBUFormOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 3 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'grey.900' }}>
            Company Detail
          </Typography>
        </Box>

        {/* Company Information Card */}
        <Paper sx={{ mb: 3, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src="/placeholder.svg"
                  alt="Company Logo"
                  style={{ width: 48, height: 48, objectFit: 'contain' }}
                />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'grey.900', mb: 1 }}>
                  {companyData.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'grey.600' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MapPinIcon style={{ width: 16, height: 16 }} />
                    <Typography variant="body2">{companyData.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EnvelopeIcon style={{ width: 16, height: 16 }} />
                    <Typography variant="body2">{companyData.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon style={{ width: 16, height: 16 }} />
                    <Typography variant="body2">{companyData.phone}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton>
                <EyeIcon style={{ width: 20, height: 20 }} />
              </IconButton>
              <IconButton onClick={() => setIsCompanyEditOpen(true)}>
                <PencilIcon style={{ width: 20, height: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Company Details Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Short Name</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{companyData.shortName}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">Type</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{companyData.type}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">PF Number</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                {companyData.pfNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary">ESIC Number</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                {companyData.esicNumber}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* SBU Details Card */}
        <Paper>
          <CardHeader
            title="SBU Details"
            action={
              <Button
                variant="contained"
                startIcon={<PlusIcon style={{ width: 20, height: 20 }} />}
                onClick={handleAddSBU}
                sx={{ bgcolor: 'primary.main' }}
              >
                Add SBU
              </Button>
            }
            sx={{ pb: 0 }}
          />
          <CardContent>
            <SBUList sbuData={sbuData} onEdit={handleEditSBU} />
          </CardContent>
        </Paper>

        {/* Company Edit Dialog */}
        <Dialog
          open={isCompanyEditOpen}
          onClose={() => setIsCompanyEditOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { maxHeight: '90vh' }
          }}
        >
          <DialogTitle>Company Detail</DialogTitle>
          <DialogContent>
            <CompanyDetailsForm onClose={() => setIsCompanyEditOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* SBU Form Drawer */}
        <Drawer
          anchor="right"
          open={isSBUFormOpen}
          onClose={() => setIsSBUFormOpen(false)}
          PaperProps={{
            sx: { width: { xs: '100%', md: '800px' } }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              SBU Detail
            </Typography>
            <SBUForm
              sbu={selectedSBU}
              onClose={() => setIsSBUFormOpen(false)}
            />
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default CompanyDetail;
