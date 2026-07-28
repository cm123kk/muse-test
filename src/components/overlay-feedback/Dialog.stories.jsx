import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

export default {
  title: 'Component/9. Overlay & Feedback/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Dialog [MUI]

A modal dialog component. Use it to focus the user's attention and request important information or a decision.

### Components

| Component | Description | Example |
|----------|------|------|
| Dialog | Dialog container | \`<Dialog open={open}>...</Dialog>\` |
| DialogTitle | Title area | Dialog title |
| DialogContent | Content area | Body, form, etc. |
| DialogActions | Action button area | Confirm, Cancel buttons |
        `,
      },
    },
  },
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', false],
      description: 'Sets the maximum width of the dialog.',
      table: {
        type: { summary: 'string | false' },
        defaultValue: { summary: 'sm' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Uses the full width up to maxWidth.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullScreen: {
      control: 'boolean',
      description: 'Displays the dialog in full screen.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    scroll: {
      control: 'select',
      options: ['paper', 'body'],
      description: 'Sets the scroll behavior.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'paper' },
      },
    },
  },
};

/** Basic dialog */
export const Default = {
  args: {
    maxWidth: 'sm',
    fullWidth: false,
    fullScreen: false,
    scroll: 'paper',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outlined" onClick={ () => setOpen(true) }>
          Open Dialog
        </Button>
        <Dialog
          open={ open }
          onClose={ () => setOpen(false) }
          maxWidth={ args.maxWidth }
          fullWidth={ args.fullWidth }
          fullScreen={ args.fullScreen }
          scroll={ args.scroll }
        >
          <DialogTitle>Basic Dialog</DialogTitle>
          <DialogContent>
            <DialogContentText>
              A dialog focuses the user's attention and is used to convey
              important information or request a decision.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => setOpen(false) }>Cancel</Button>
            <Button onClick={ () => setOpen(false) } variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

/** Confirmation dialog */
export const Confirmation = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" color="error" onClick={ () => setOpen(true) }>
          Delete
        </Button>
        <Dialog open={ open } onClose={ () => setOpen(false) }>
          <DialogTitle>Delete this item?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone. The selected item will be permanently deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => setOpen(false) }>Cancel</Button>
            <Button onClick={ () => setOpen(false) } color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

/** Form dialog */
export const FormDialog = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={ () => setOpen(true) }>
          Add New Item
        </Button>
        <Dialog open={ open } onClose={ () => setOpen(false) } maxWidth="sm" fullWidth>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogContent>
            <DialogContentText sx={ { mb: 2 } }>
              Please enter the information for the new item.
            </DialogContentText>
            <Stack spacing={ 2 }>
              <TextField
                autoFocus
                label="Title"
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={ 3 }
                variant="outlined"
              />
              <TextField
                label="Category"
                fullWidth
                variant="outlined"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => setOpen(false) }>Cancel</Button>
            <Button onClick={ () => setOpen(false) } variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

/** Alert dialog */
export const Alert = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outlined" color="warning" onClick={ () => setOpen(true) }>
          Show Warning
        </Button>
        <Dialog open={ open } onClose={ () => setOpen(false) }>
          <DialogTitle sx={ { color: 'warning.main' } }>
            Attention Required
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have unsaved changes.
              If you leave this page, your changes will be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => setOpen(false) }>
              Keep Editing
            </Button>
            <Button onClick={ () => setOpen(false) } color="warning">
              Don't Save
            </Button>
            <Button onClick={ () => setOpen(false) } variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

/** Size variants */
export const Sizes = {
  render: () => {
    const [openSize, setOpenSize] = useState(null);

    const sizes = ['xs', 'sm', 'md', 'lg'];

    return (
      <>
        <Stack direction="row" spacing={ 2 }>
          { sizes.map((size) => (
            <Button key={ size } variant="outlined" onClick={ () => setOpenSize(size) }>
              { size.toUpperCase() }
            </Button>
          )) }
        </Stack>
        { sizes.map((size) => (
          <Dialog
            key={ size }
            open={ openSize === size }
            onClose={ () => setOpenSize(null) }
            maxWidth={ size }
            fullWidth
          >
            <DialogTitle>maxWidth: { size }</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Setting fullWidth to true uses the full width up to maxWidth.
                The current maxWidth is "{ size }".
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={ () => setOpenSize(null) }>Close</Button>
            </DialogActions>
          </Dialog>
        )) }
      </>
    );
  },
};

/** Scrollable dialog */
export const Scrollable = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outlined" onClick={ () => setOpen(true) }>
          Long Content Dialog
        </Button>
        <Dialog
          open={ open }
          onClose={ () => setOpen(false) }
          scroll="paper"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogContent dividers>
            { [...Array(10)].map((_, index) => (
              <Typography key={ index } paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur.
              </Typography>
            )) }
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => setOpen(false) }>Cancel</Button>
            <Button onClick={ () => setOpen(false) } variant="contained">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

/** List dialog */
export const ListDialog = {
  render: () => {
    const [open, setOpen] = useState(false);

    const users = [
      { name: 'James Kim', email: 'kim@example.com' },
      { name: 'Emily Lee', email: 'lee@example.com' },
      { name: 'Michael Park', email: 'park@example.com' },
      { name: 'Sophia Choi', email: 'choi@example.com' },
    ];

    return (
      <>
        <Button variant="outlined" onClick={ () => setOpen(true) }>
          Select User
        </Button>
        <Dialog open={ open } onClose={ () => setOpen(false) }>
          <DialogTitle>Select Assignee</DialogTitle>
          <List sx={ { pt: 0 } }>
            { users.map((user) => (
              <ListItem
                key={ user.email }
                component="button"
                onClick={ () => setOpen(false) }
                sx={ {
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                } }
              >
                <ListItemAvatar>
                  <Avatar sx={ { bgcolor: 'primary.main' } }>
                    { user.name[0] }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ user.name } secondary={ user.email } />
              </ListItem>
            )) }
          </List>
        </Dialog>
      </>
    );
  },
};

/** Custom header */
export const CustomHeader = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={ () => setOpen(true) }>
          Open Settings
        </Button>
        <Dialog open={ open } onClose={ () => setOpen(false) } maxWidth="sm" fullWidth>
          <DialogTitle sx={ { m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
            <Typography variant="h6" component="span">
              Settings
            </Typography>
            <IconButton
              onClick={ () => setOpen(false) }
              sx={ { color: 'grey.500' } }
            >
              <Box component="span" sx={ { fontSize: 20 } }>✕</Box>
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={ 3 }>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Notification Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure email notifications, push notifications, and more.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Privacy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your profile information and privacy settings.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Security
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage security settings such as password changes and two-factor authentication.
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={ () => setOpen(false) }>Close</Button>
            <Button onClick={ () => setOpen(false) } variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

/** Nested dialog */
export const Nested = {
  render: () => {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);

    return (
      <>
        <Button variant="outlined" onClick={ () => setOpen1(true) }>
          First Dialog
        </Button>

        <Dialog open={ open1 } onClose={ () => setOpen1(false) }>
          <DialogTitle>First Dialog</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You can open another dialog from inside a dialog.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => setOpen1(false) }>Close</Button>
            <Button onClick={ () => setOpen2(true) } variant="contained">
              Open Next Dialog
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={ open2 } onClose={ () => setOpen2(false) }>
          <DialogTitle>Second Dialog</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This is a nested dialog.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={ () => setOpen2(false) }
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};

/** Real-world example: login */
export const LoginDialog = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={ () => setOpen(true) }>
          Log In
        </Button>
        <Dialog open={ open } onClose={ () => setOpen(false) } maxWidth="xs" fullWidth>
          <DialogTitle sx={ { textAlign: 'center', pt: 4 } }>
            <Typography variant="h5" sx={ { fontWeight: 700 } }>
              Log In
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={ 2 } sx={ { mt: 1 } }>
              <TextField
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
              />
              <Button variant="contained" fullWidth size="large">
                Log In
              </Button>
              <Divider>or</Divider>
              <Button variant="outlined" fullWidth>
                Continue with Google
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions sx={ { justifyContent: 'center', pb: 3 } }>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?
              <Button size="small">Sign Up</Button>
            </Typography>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};
