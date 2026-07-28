import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import { DocumentTitle, PageContainer, SectionTitle } from '../../components/storybookDocumentation';
import {
  ruleNodes,
  ruleEdges,
  edgeTypes,
  priorityMeta,
  conditionMatrix,
} from '../../data/ruleRelationships';

export default {
  title: 'Overview/Rule Relationships',
  parameters: {
    layout: 'padded',
  },
};

/**
 * PriorityChip - priority badge
 *
 * Props:
 * @param {string} priority - priority key (root, CRITICAL, MUST, SHOULD, Reference, Skill, Skill Resource) [Required]
 */
function PriorityChip({ priority }) {
  const meta = priorityMeta[priority];
  if (!meta) return null;

  return (
    <Chip
      label={ priority }
      size="small"
      sx={ {
        backgroundColor: meta.color,
        color: '#fff',
        fontWeight: 600,
        fontSize: 11,
        height: 22,
      } }
    />
  );
}

/**
 * TreeDiagram - rule hierarchy tree centered on CLAUDE.md
 *
 * Based on the ruleNodes and ruleEdges data, visually represents
 * the load relationships from CLAUDE.md to each sub-rule.
 */
function TreeDiagram() {
  const root = ruleNodes.find((n) => n.id === 'claude-md');

  // Auto-load groups (CLAUDE.md -> loads)
  const ruleGroups = {
    CRITICAL: ruleNodes.filter((n) => n.priority === 'CRITICAL'),
    MUST: ruleNodes.filter((n) => n.priority === 'MUST'),
    SHOULD: ruleNodes.filter((n) => n.priority === 'SHOULD'),
    Reference: ruleNodes.filter((n) => n.priority === 'Reference'),
  };

  // Skill groups (CLAUDE.md -> activates)
  const skillNodes = ruleNodes.filter((n) => n.priority === 'Skill');
  const skillResourceNodes = ruleNodes.filter((n) => n.priority === 'Skill Resource');

  // Reference edges between sub-rules (excluding loads, activates)
  const crossEdges = ruleEdges.filter(
    (e) => e.from !== 'claude-md' && e.type === 'references'
  );

  // Skill -> Resource edges
  const resourceEdges = ruleEdges.filter((e) => e.type === 'resources');

  return (
    <Box sx={ { p: 3, border: '1px solid', borderColor: 'divider' } }>
      {/* Root */}
      <Box
        sx={ {
          display: 'inline-block',
          px: 2,
          py: 1,
          border: '2px solid',
          borderColor: '#000',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 14,
          mb: 3,
        } }
      >
        { root.name }
      </Box>

      {/* Auto-load rule groups */}
      <Typography variant="caption" color="text.secondary" sx={ { display: 'block', pl: 4, mb: 1 } }>
        Auto-load (loads)
      </Typography>
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2, pl: 4, mb: 3 } }>
        { Object.entries(ruleGroups).map(([priority, nodes]) => {
          if (nodes.length === 0) return null;

          return (
            <Box key={ priority }>
              <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 1 } }>
                <Box
                  sx={ {
                    width: 24,
                    borderTop: '1px solid',
                    borderColor: 'text.disabled',
                  } }
                />
                <PriorityChip priority={ priority } />
                <Typography variant="caption" color="text.secondary">
                  { priorityMeta[priority].label }
                </Typography>
              </Box>
              <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1, pl: 4 } }>
                { nodes.map((node) => (
                  <Box
                    key={ node.id }
                    sx={ {
                      px: 1.5,
                      py: 0.5,
                      border: '1px solid',
                      borderColor: priorityMeta[priority].color,
                      borderLeftWidth: 3,
                      fontFamily: 'monospace',
                      fontSize: 12,
                    } }
                  >
                    { node.name }
                  </Box>
                )) }
              </Box>
            </Box>
          );
        }) }
      </Box>

      {/* Skill groups (intent-based activation) */}
      { skillNodes.length > 0 && (
        <>
          <Typography variant="caption" color="text.secondary" sx={ { display: 'block', pl: 4, mb: 1 } }>
            Intent-based activation (activates)
          </Typography>
          <Box sx={ { pl: 4, mb: 2 } }>
            { skillNodes.map((node) => (
              <Box key={ node.id } sx={ { mb: 2 } }>
                <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 1 } }>
                  <Box
                    sx={ {
                      width: 24,
                      borderTop: '2px dashed',
                      borderColor: priorityMeta.Skill.color,
                    } }
                  />
                  <Box
                    sx={ {
                      px: 1.5,
                      py: 0.5,
                      border: '2px solid',
                      borderColor: priorityMeta.Skill.color,
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: 700,
                    } }
                  >
                    { node.name }
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    { node.description }
                  </Typography>
                </Box>

                {/* Skill Resources */}
                { skillResourceNodes.length > 0 && (
                  <Box sx={ { pl: 6 } }>
                    <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 0.5 } }>
                      on-demand Read (resources)
                    </Typography>
                    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1 } }>
                      { skillResourceNodes.map((res) => {
                        const edge = resourceEdges.find((e) => e.to === res.id);

                        return (
                          <Box
                            key={ res.id }
                            sx={ {
                              px: 1.5,
                              py: 0.5,
                              border: '1px dashed',
                              borderColor: priorityMeta['Skill Resource'].color,
                              fontFamily: 'monospace',
                              fontSize: 11,
                              color: 'text.secondary',
                            } }
                            title={ edge?.note || res.description }
                          >
                            { res.name }
                          </Box>
                        );
                      }) }
                    </Box>
                  </Box>
                ) }
              </Box>
            )) }
          </Box>
        </>
      ) }

      {/* Cross-rule references */}
      { crossEdges.length > 0 && (
        <Box sx={ { mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' } }>
          <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 1 } }>
            Cross-rule references (references)
          </Typography>
          { crossEdges.map((edge, i) => {
            const fromNode = ruleNodes.find((n) => n.id === edge.from);
            const toNode = ruleNodes.find((n) => n.id === edge.to);

            return (
              <Typography
                key={ i }
                variant="caption"
                sx={ { display: 'block', fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' } }
              >
                { fromNode?.name } {'  \u2192  '} { toNode?.name }
                { edge.note && ` (${edge.note})` }
              </Typography>
            );
          }) }
        </Box>
      ) }
    </Box>
  );
}

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="Rule Relationships"
        status="Available"
        note="Project rule structure and relationships"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Rule Relationships
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          The hierarchy and reference relationships of project rules, centered on CLAUDE.md.
        </Typography>

        {/* 1. Rule hierarchy */}
        <SectionTitle title="Rule Hierarchy" description="Load relationships from CLAUDE.md to each sub-rule" />
        <Box sx={ { mb: 4 } }>
          <TreeDiagram />
        </Box>

        {/* 2. Rule list */}
        <SectionTitle title="Rule List" description="All rule files with their priority and role" />
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>File Name</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Priority</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { ruleNodes.map((node) => (
                <TableRow key={ node.id }>
                  <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                    { node.name }
                  </TableCell>
                  <TableCell>
                    <PriorityChip priority={ node.priority } />
                  </TableCell>
                  <TableCell sx={ { color: 'text.secondary', fontSize: 13 } }>
                    { node.description }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 3. Reference relationships */}
        <SectionTitle title="Reference Relationships" description="How rules reference each other and in which direction" />
        <Box sx={ { display: 'flex', gap: 3, mb: 2 } }>
          { Object.entries(edgeTypes).map(([key, meta]) => (
            <Box key={ key } sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
              <Box
                sx={ {
                  width: 24,
                  borderTop: `2px ${meta.style}`,
                  borderColor: 'text.primary',
                } }
              />
              <Typography variant="caption" color="text.secondary">
                { meta.label }
              </Typography>
            </Box>
          )) }
        </Box>
        <TableContainer sx={ { mb: 4 } }>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>From</TableCell>
                <TableCell sx={ { fontWeight: 600 } }></TableCell>
                <TableCell sx={ { fontWeight: 600 } }>To</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Type</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { ruleEdges.map((edge, i) => {
                  const fromNode = ruleNodes.find((n) => n.id === edge.from);
                  const toNode = ruleNodes.find((n) => n.id === edge.to);

                  return (
                    <TableRow key={ i }>
                      <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                        { fromNode?.name }
                      </TableCell>
                      <TableCell sx={ { textAlign: 'center' } }>{'\u2192'}</TableCell>
                      <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                        { toNode?.name }
                      </TableCell>
                      <TableCell sx={ { fontSize: 12 } }>
                        { edgeTypes[edge.type]?.label }
                      </TableCell>
                      <TableCell sx={ { color: 'text.secondary', fontSize: 12 } }>
                        { edge.note || '-' }
                      </TableCell>
                    </TableRow>
                  );
                }) }
            </TableBody>
          </Table>
        </TableContainer>

        {/* 4. Usage condition matrix */}
        <SectionTitle title="Usage Condition Matrix" description="Rules and skills to check for each task type" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Task Type</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Rules to Check</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Skill</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Skill Resources</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { conditionMatrix.map((row, i) => (
                <TableRow key={ i }>
                  <TableCell sx={ { fontWeight: 600, fontSize: 13 } }>
                    { row.task }
                  </TableCell>
                  <TableCell>
                    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
                      { row.rules.map((ruleId) => {
                        const node = ruleNodes.find((n) => n.id === ruleId);
                        const meta = priorityMeta[node?.priority];

                        return (
                          <Chip
                            key={ ruleId }
                            label={ node?.name?.replace('.md', '') }
                            size="small"
                            variant="outlined"
                            sx={ {
                              fontSize: 11,
                              height: 22,
                              borderColor: meta?.color,
                              color: meta?.color,
                            } }
                          />
                        );
                      }) }
                    </Box>
                  </TableCell>
                  <TableCell>
                    { row.skill ? (
                      <Chip
                        label={ row.skill }
                        size="small"
                        sx={ {
                          fontSize: 11,
                          height: 22,
                          backgroundColor: priorityMeta.Skill?.color,
                          color: '#fff',
                        } }
                      />
                    ) : (
                      <Typography variant="caption" color="text.disabled">-</Typography>
                    ) }
                  </TableCell>
                  <TableCell>
                    { row.skillResources?.length > 0 ? (
                      <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
                        { row.skillResources.map((resId) => {
                          const node = ruleNodes.find((n) => n.id === resId);

                          return (
                            <Chip
                              key={ resId }
                              label={ node?.name?.replace('.md', '') }
                              size="small"
                              variant="outlined"
                              sx={ {
                                fontSize: 11,
                                height: 22,
                                borderColor: priorityMeta['Skill Resource']?.color,
                                color: priorityMeta['Skill Resource']?.color,
                              } }
                            />
                          );
                        }) }
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled">-</Typography>
                    ) }
                  </TableCell>
                  <TableCell sx={ { color: 'text.secondary', fontSize: 12 } }>
                    { row.note || '-' }
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
