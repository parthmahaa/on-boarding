import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid as MuiGrid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Collapse
} from '@mui/material';
import {
  CloudArrowUpIcon,
  CalendarIcon,
  EyeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

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

interface SBUFormProps {
  sbu?: SBU | null;
  onClose: () => void;
}

const Grid = (props: any) => <MuiGrid {...props} item />;

const SBUForm: React.FC<SBUFormProps> = ({ sbu, onClose }) => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleSubmit = () => {
    toast.success('SBU details saved successfully!');
    onClose();
  };

  const handleReset = () => {
    toast.info('Form has been reset');
  };

  const handleCopyFromParent = () => {
    toast.info('Data copied from parent company');
  };

  return (
    <Box>
      {/* Copy From Parent Company Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCopyFromParent}
        >
          Copy From Parent Company
        </Button>
      </Box>

      {/* SBU Details Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="SBU Details" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={2.4}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Upload company logo
              </Typography>
              <Paper
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <Button
                  startIcon={<CloudArrowUpIcon style={{ width: 20, height: 20 }} />}
                  sx={{ color: 'primary.main' }}
                >
                  Click to Upload
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="Name *"
                defaultValue={sbu?.companyName || ""}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="Short Name *"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="URL"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>Type *</InputLabel>
                <Select label="Type *" defaultValue={sbu?.type?.toLowerCase()}>
                  <MenuItem value="partnership">Partnership</MenuItem>
                  <MenuItem value="pvt-ltd">Pvt. Ltd</MenuItem>
                  <MenuItem value="public">Public Ltd</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="Registration Date"
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton size="small">
                      <CalendarIcon style={{ width: 20, height: 20 }} />
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="Identification Number"
                defaultValue={sbu?.identificationNumber || ""}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="GST Registration Number"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="TAN Number"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="PAN Number"
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Address Details Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Address Details" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="Pin code *"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>Country *</InputLabel>
                <Select label="Country *">
                  <MenuItem value="india">India</MenuItem>
                  <MenuItem value="usa">USA</MenuItem>
                  <MenuItem value="uk">UK</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>State *</InputLabel>
                <Select label="State *">
                  <MenuItem value="gujarat">Gujarat</MenuItem>
                  <MenuItem value="maharashtra">Maharashtra</MenuItem>
                  <MenuItem value="delhi">Delhi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>City *</InputLabel>
                <Select label="City *">
                  <MenuItem value="ahmedabad">Ahmedabad</MenuItem>
                  <MenuItem value="mumbai">Mumbai</MenuItem>
                  <MenuItem value="delhi">Delhi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                fullWidth
                label="Phone Number *"
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address *"
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Additional Information Toggle */}
      <Button
        onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
        variant="contained"
        sx={{ mb: 3 }}
      >
        Additional Information
      </Button>

      {/* Additional Information Section */}
      <Collapse in={showAdditionalInfo}>
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Additional Information" />
          <CardContent>
            {/* HR Setup Details */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              HR Setup Details
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Salary Slip Format *</InputLabel>
                    <Select label="Salary Slip Format *">
                      <MenuItem value="format1">Format 1</MenuItem>
                      <MenuItem value="format2">Format 2</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton>
                    <EyeIcon style={{ width: 20, height: 20 }} />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Employee ID By SBU"
                />
              </Grid>
            </Grid>

            {/* HR Details */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              HR Details
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Whatsapp Number"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
                  <TextField
                    fullWidth
                    label="Emails *"
                    variant="outlined"
                    size="small"
                  />
                  <IconButton>
                    <InformationCircleIcon style={{ width: 20, height: 20 }} />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <FormControlLabel
              control={<Checkbox />}
              label="Ticket Updates on HR Mail"
              sx={{ mb: 3 }}
            />

            {/* Bank Details */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bank Details
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Account Number"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Branch Code"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              variant="outlined"
            />
          </CardContent>
        </Card>
      </Collapse>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
        <Button variant="outlined" color="error" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default SBUForm;
